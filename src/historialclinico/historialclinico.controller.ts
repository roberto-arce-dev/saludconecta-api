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
import { HistorialClinicoService } from './historialclinico.service';
import { CreateHistorialClinicoDto } from './dto/create-historialclinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historialclinico.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('HistorialClinico')
@ApiBearerAuth('JWT-auth')
@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(
    private readonly historialclinicoService: HistorialClinicoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo HistorialClinico' })
  @ApiBody({ type: CreateHistorialClinicoDto })
  @ApiResponse({ status: 201, description: 'HistorialClinico creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createHistorialClinicoDto: CreateHistorialClinicoDto) {
    const data = await this.historialclinicoService.create(createHistorialClinicoDto);
    return {
      success: true,
      message: 'HistorialClinico creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Historialclinico' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Historialclinico' })
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
  @ApiResponse({ status: 404, description: 'Historialclinico no encontrado' })
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
    const updated = await this.historialclinicoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { historialclinico: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los HistorialClinicos' })
  @ApiResponse({ status: 200, description: 'Lista de HistorialClinicos' })
  async findAll() {
    const data = await this.historialclinicoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener HistorialClinico por ID' })
  @ApiParam({ name: 'id', description: 'ID del HistorialClinico' })
  @ApiResponse({ status: 200, description: 'HistorialClinico encontrado' })
  @ApiResponse({ status: 404, description: 'HistorialClinico no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.historialclinicoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar HistorialClinico' })
  @ApiParam({ name: 'id', description: 'ID del HistorialClinico' })
  @ApiBody({ type: UpdateHistorialClinicoDto })
  @ApiResponse({ status: 200, description: 'HistorialClinico actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'HistorialClinico no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateHistorialClinicoDto: UpdateHistorialClinicoDto
  ) {
    const data = await this.historialclinicoService.update(id, updateHistorialClinicoDto);
    return {
      success: true,
      message: 'HistorialClinico actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar HistorialClinico' })
  @ApiParam({ name: 'id', description: 'ID del HistorialClinico' })
  @ApiResponse({ status: 200, description: 'HistorialClinico eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'HistorialClinico no encontrado' })
  async remove(@Param('id') id: string) {
    const historialclinico = await this.historialclinicoService.findOne(id);
    if (historialclinico.imagen) {
      const filename = historialclinico.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.historialclinicoService.remove(id);
    return { success: true, message: 'HistorialClinico eliminado exitosamente' };
  }
}
