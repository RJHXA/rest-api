import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { UserRole } from "../enum/role.enum";

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
  pageSize?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ required: false })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isActive?: boolean;
}