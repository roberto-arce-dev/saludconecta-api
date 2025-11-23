import { PartialType } from '@nestjs/swagger';
import { CreateHistorialClinicoDto } from './create-historialclinico.dto';

export class UpdateHistorialClinicoDto extends PartialType(CreateHistorialClinicoDto) {}
