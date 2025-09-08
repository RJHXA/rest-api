import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class GetUsersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(50)
  @ApiProperty({ required: false })
  page_size?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  q?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ required: false })
  role?: UserRole;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @ApiProperty({ required: false })
  is_active?: boolean;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'order must be asc or desc' })
  @ApiProperty({ required: false })
  order?: 'asc' | 'desc';
}
