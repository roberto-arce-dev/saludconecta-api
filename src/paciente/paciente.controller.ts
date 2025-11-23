import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Paciente')
@ApiBearerAuth('JWT-auth')
@Controller('paciente')
export class PacienteController {
  constructor(
    private readonly pacienteService: PacienteService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Paciente' })
  @ApiBody({ type: CreatePacienteDto })
  @ApiResponse({ status: 201, description: 'Paciente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createPacienteDto: CreatePacienteDto) {
    const data = await this.pacienteService.create(createPacienteDto);
    return {
      success: true,
      message: 'Paciente creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Paciente' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Paciente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.pacienteService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { paciente: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de Pacientes' })
  async findAll() {
    const data = await this.pacienteService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Paciente por ID' })
  @ApiParam({ name: 'id', description: 'ID del Paciente' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.pacienteService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Paciente' })
  @ApiParam({ name: 'id', description: 'ID del Paciente' })
  @ApiBody({ type: UpdatePacienteDto })
  @ApiResponse({ status: 200, description: 'Paciente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updatePacienteDto: UpdatePacienteDto
  ) {
    const data = await this.pacienteService.update(id, updatePacienteDto);
    return {
      success: true,
      message: 'Paciente actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Paciente' })
  @ApiParam({ name: 'id', description: 'ID del Paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  async remove(@Param('id') id: string) {
    const paciente = await this.pacienteService.findOne(id);
    if (paciente.imagen) {
      const filename = paciente.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.pacienteService.remove(id);
    return { success: true, message: 'Paciente eliminado exitosamente' };
  }
}
