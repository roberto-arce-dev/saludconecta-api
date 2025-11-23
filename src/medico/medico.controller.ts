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
import { MedicoService } from './medico.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Medico')
@ApiBearerAuth('JWT-auth')
@Controller('medico')
export class MedicoController {
  constructor(
    private readonly medicoService: MedicoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Medico' })
  @ApiBody({ type: CreateMedicoDto })
  @ApiResponse({ status: 201, description: 'Medico creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createMedicoDto: CreateMedicoDto) {
    const data = await this.medicoService.create(createMedicoDto);
    return {
      success: true,
      message: 'Medico creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Medico' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Medico' })
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
  @ApiResponse({ status: 404, description: 'Medico no encontrado' })
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
    const updated = await this.medicoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { medico: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Medicos' })
  @ApiResponse({ status: 200, description: 'Lista de Medicos' })
  async findAll() {
    const data = await this.medicoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Medico por ID' })
  @ApiParam({ name: 'id', description: 'ID del Medico' })
  @ApiResponse({ status: 200, description: 'Medico encontrado' })
  @ApiResponse({ status: 404, description: 'Medico no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.medicoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Medico' })
  @ApiParam({ name: 'id', description: 'ID del Medico' })
  @ApiBody({ type: UpdateMedicoDto })
  @ApiResponse({ status: 200, description: 'Medico actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Medico no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateMedicoDto: UpdateMedicoDto
  ) {
    const data = await this.medicoService.update(id, updateMedicoDto);
    return {
      success: true,
      message: 'Medico actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Medico' })
  @ApiParam({ name: 'id', description: 'ID del Medico' })
  @ApiResponse({ status: 200, description: 'Medico eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Medico no encontrado' })
  async remove(@Param('id') id: string) {
    const medico = await this.medicoService.findOne(id);
    if (medico.imagen) {
      const filename = medico.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.medicoService.remove(id);
    return { success: true, message: 'Medico eliminado exitosamente' };
  }
}
