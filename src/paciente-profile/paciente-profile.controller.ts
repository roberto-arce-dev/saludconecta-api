import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PacienteProfileService } from './paciente-profile.service';
import { CreatePacienteProfileDto } from './dto/create-paciente-profile.dto';
import { UpdatePacienteProfileDto } from './dto/update-paciente-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('paciente-profile')
@ApiBearerAuth()
@Controller('paciente-profile')
export class PacienteProfileController {
  constructor(private readonly pacienteprofileService: PacienteProfileService) {}

  @Get('me')
  @Roles(Role.PACIENTE)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.pacienteprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.PACIENTE)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdatePacienteProfileDto) {
    return this.pacienteprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.pacienteprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.pacienteprofileService.findByUserId(userId);
  }
}
