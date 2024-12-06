import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class FilterJobsDto {
  @IsOptional()
  country?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
