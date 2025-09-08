import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enum/role.enum';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsEnum(UserRole)
  @ApiProperty()
  role: UserRole;

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;
}
