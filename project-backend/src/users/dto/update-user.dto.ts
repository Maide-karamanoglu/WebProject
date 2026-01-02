import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Omit password from required fields - it should be optional for updates
export class UpdateUserDto extends PartialType(CreateUserDto) { }
