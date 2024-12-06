import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobDto, CreateJobsDto } from './dto/create-job.dto';
import { FilterJobsDto } from './dto/filter-jobs.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('external')
  async getExternalJobs() {
    return await this.jobsService.fetchExternalJobs();
  }

  @Get('filter')
  async filterJobs(@Query() filterDto: FilterJobsDto) {
    return this.jobsService.findFiltered(filterDto);
  }

  @Get()
  findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Job> {
    return this.jobsService.findOne(+id);
  }

  @Post('bulkcreate')
  async bulkCreate(@Body() createJobsDto: CreateJobsDto) {
    return this.jobsService.bulkCreate(createJobsDto.jobs);
  }

  @Post()
  create(@Body() createJob: CreateJobDto) {
    return this.jobsService.create(createJob);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() job: Partial<Job>): Promise<Job> {
    return this.jobsService.update(+id, job);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.jobsService.delete(+id);
  }
}
