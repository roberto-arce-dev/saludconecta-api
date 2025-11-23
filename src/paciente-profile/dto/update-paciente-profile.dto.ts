import { PartialType } from '@nestjs/swagger';
import { CreatePacienteProfileDto } from './create-paciente-profile.dto';

export class UpdatePacienteProfileDto extends PartialType(CreatePacienteProfileDto) {}
