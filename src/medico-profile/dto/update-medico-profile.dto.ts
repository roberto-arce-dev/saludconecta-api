import { PartialType } from '@nestjs/swagger';
import { CreateMedicoProfileDto } from './create-medico-profile.dto';

export class UpdateMedicoProfileDto extends PartialType(CreateMedicoProfileDto) {}
