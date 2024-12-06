import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsUniqueArray } from '../decorators/is-unique-array.decorator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'The job position needs a name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  salary: number;

  @IsArray()
  @IsString({ each: true })
  @IsUniqueArray({ message: 'Skills must be unique.' })
  @IsOptional()
  skills: string[];
}

export class CreateJobsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobDto)
  jobs: CreateJobDto[];
}
