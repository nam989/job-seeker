import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateJobDto, CreateJobsDto } from './dto/create-job.dto';
import { XmlParserService } from '../xml/xml-parser.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FilterJobsDto } from './dto/filter-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly httpService: HttpService,
    private readonly XmlParserService: XmlParserService,
  ) {}

  findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  findOne(id: number): Promise<Job> {
    return this.jobRepository.findOneBy({ id });
  }

  async findFiltered(filterDto: FilterJobsDto): Promise<Job[]> {
    const query = this.jobRepository.createQueryBuilder('jobs');
    const { country, salary, skills } = filterDto;

    if (country) {
      query.andWhere('jobs.country LIKE :country', { country: `%${country}%` });
    }

    if (salary) {
      query.andWhere('jobs.salary >= :salary', { salary });
    }

    if (skills) {
      skills.forEach((skill) =>
        query.andWhere('jobs.skills LIKE :skills', {
          skills: `%${skill}%`,
        }),
      );
    }

    return query.getMany();
  }

  create(job: CreateJobDto): Promise<Job> {
    return this.jobRepository.save(job);
  }

  async bulkCreate(jobs: CreateJobDto[]): Promise<Job[]> {
    const jobEntities = this.jobRepository.create(jobs);
    const savedJobs = await this.jobRepository.save(jobEntities);
    return savedJobs;
  }

  async fetchExternalJobs(): Promise<Job[]> {
    const endpointUrl = 'http://localhost:8080/jobs';
    try {
      const externalJobs: any = await firstValueFrom(
        this.httpService.get(endpointUrl),
      );
      if (externalJobs?.data) {
        const jobsByCountry = externalJobs.data;
        let jobs = [];
        for (let country in jobsByCountry) {
          jobs.push(
            await Promise.all(
              jobsByCountry[country].map(async (job) => ({
                name: job[0] || 'Generic job',
                country: country || 'Global',
                description: '',
                salary: job[1] || 0,
                skills: (await this.XmlParserService.parseSkills(job[2])) || [],
              })),
            ),
          );
        }
        const flattenedJobsArray = jobs.flat();

        // Validates the DTO
        const jobsDto = plainToInstance(CreateJobsDto, {
          jobs: flattenedJobsArray,
        });

        const errors = await validate(jobsDto);

        if (errors.length > 0) {
          throw new Error('Invalid jobs from source');
        } else {
          return this.bulkCreate(flattenedJobsArray);
        }
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      throw new Error(`Failed to fetch external jobs: ${error.message}`);
    }
  }

  async update(id: number, job: Partial<Job>): Promise<Job> {
    await this.jobRepository.update(id, job);
    return this.findOne(id);
  }

  delete(id: number): Promise<void> {
    return this.jobRepository.delete(id).then(() => undefined);
  }
}
