import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MedicoProfileService } from './medico-profile.service';
import { CreateMedicoProfileDto } from './dto/create-medico-profile.dto';
import { UpdateMedicoProfileDto } from './dto/update-medico-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('medico-profile')
@ApiBearerAuth()
@Controller('medico-profile')
export class MedicoProfileController {
  constructor(private readonly medicoprofileService: MedicoProfileService) {}

  @Get('me')
  @Roles(Role.MEDICO)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.medicoprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.MEDICO)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateMedicoProfileDto) {
    return this.medicoprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.medicoprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.medicoprofileService.findByUserId(userId);
  }
}
