import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

/**
 * DTO para registro de usuarios
 * Crea User + Profile correspondiente según el rol
 */
export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: Role.PACIENTE,
    description: 'Rol del usuario',
    enum: [Role.PACIENTE, Role.MEDICO],
  })
  @IsNotEmpty()
  @IsEnum([Role.PACIENTE, Role.MEDICO])
  role: Role;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'fechaNacimiento (opcional)',
  })
  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'grupoSanguineo (opcional)',
  })
  @IsOptional()
  @IsString()
  grupoSanguineo?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'alergias (opcional)',
  })
  @IsOptional()
  @IsArray()
  alergias?: string[];

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'contactoEmergencia (opcional)',
  })
  @IsOptional()
  @IsString()
  contactoEmergencia?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'especialidad (para rol MEDICO)',
  })
  @ValidateIf((o) => o.role === Role.MEDICO)
  @IsNotEmpty({ message: 'especialidad es requerido para MEDICO' })
  @IsString()
  especialidad?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'cmp (para rol MEDICO)',
  })
  @ValidateIf((o) => o.role === Role.MEDICO)
  @IsNotEmpty({ message: 'cmp es requerido para MEDICO' })
  @IsString()
  cmp?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'consultorio (opcional)',
  })
  @IsOptional()
  @IsString()
  consultorio?: string;

}
