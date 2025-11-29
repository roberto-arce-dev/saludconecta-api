import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgendarCitaDto {
  @ApiProperty({
    example: '64f5a2b8c8e6f8a123456789',
    description: 'ID del paciente',
  })
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @ApiProperty({
    example: '64f5a2b8c8e6f8a987654321',
    description: 'ID del médico',
  })
  @IsNotEmpty()
  @IsString()
  medicoId: string;

  @ApiProperty({
    example: '2024-12-01T10:00:00Z',
    description: 'Fecha y hora de la cita',
  })
  @IsNotEmpty()
  @IsString()
  fechaCita: string;

  @ApiProperty({
    example: 'Dolor de cabeza persistente',
    description: 'Motivo de la consulta',
  })
  @IsNotEmpty()
  @IsString()
  motivoConsulta: string;
}