import { PartialType } from '@nestjs/swagger';
import { CreateCitaMedicaDto } from './create-citamedica.dto';

export class UpdateCitaMedicaDto extends PartialType(CreateCitaMedicaDto) {}
