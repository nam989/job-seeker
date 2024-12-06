import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { XmlParserService } from 'src/xml/xml-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), HttpModule],
  providers: [JobsService, XmlParserService],
  controllers: [JobsController],
})
export class JobsModule {}
