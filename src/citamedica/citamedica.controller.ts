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
import { CitaMedicaService } from './citamedica.service';
import { CreateCitaMedicaDto } from './dto/create-citamedica.dto';
import { UpdateCitaMedicaDto } from './dto/update-citamedica.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('CitaMedica')
@ApiBearerAuth('JWT-auth')
@Controller('cita-medica')
export class CitaMedicaController {
  constructor(
    private readonly citamedicaService: CitaMedicaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo CitaMedica' })
  @ApiBody({ type: CreateCitaMedicaDto })
  @ApiResponse({ status: 201, description: 'CitaMedica creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createCitaMedicaDto: CreateCitaMedicaDto) {
    const data = await this.citamedicaService.create(createCitaMedicaDto);
    return {
      success: true,
      message: 'CitaMedica creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Citamedica' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Citamedica' })
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
  @ApiResponse({ status: 404, description: 'Citamedica no encontrado' })
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
    const updated = await this.citamedicaService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { citamedica: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los CitaMedicas' })
  @ApiResponse({ status: 200, description: 'Lista de CitaMedicas' })
  async findAll() {
    const data = await this.citamedicaService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener CitaMedica por ID' })
  @ApiParam({ name: 'id', description: 'ID del CitaMedica' })
  @ApiResponse({ status: 200, description: 'CitaMedica encontrado' })
  @ApiResponse({ status: 404, description: 'CitaMedica no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.citamedicaService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar CitaMedica' })
  @ApiParam({ name: 'id', description: 'ID del CitaMedica' })
  @ApiBody({ type: UpdateCitaMedicaDto })
  @ApiResponse({ status: 200, description: 'CitaMedica actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'CitaMedica no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateCitaMedicaDto: UpdateCitaMedicaDto
  ) {
    const data = await this.citamedicaService.update(id, updateCitaMedicaDto);
    return {
      success: true,
      message: 'CitaMedica actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar CitaMedica' })
  @ApiParam({ name: 'id', description: 'ID del CitaMedica' })
  @ApiResponse({ status: 200, description: 'CitaMedica eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'CitaMedica no encontrado' })
  async remove(@Param('id') id: string) {
    const citamedica = await this.citamedicaService.findOne(id);
    if (citamedica.imagen) {
      const filename = citamedica.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.citamedicaService.remove(id);
    return { success: true, message: 'CitaMedica eliminado exitosamente' };
  }
}
