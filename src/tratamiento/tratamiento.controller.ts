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
import { TratamientoService } from './tratamiento.service';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Tratamiento')
@ApiBearerAuth('JWT-auth')
@Controller('tratamiento')
export class TratamientoController {
  constructor(
    private readonly tratamientoService: TratamientoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Tratamiento' })
  @ApiBody({ type: CreateTratamientoDto })
  @ApiResponse({ status: 201, description: 'Tratamiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createTratamientoDto: CreateTratamientoDto) {
    const data = await this.tratamientoService.create(createTratamientoDto);
    return {
      success: true,
      message: 'Tratamiento creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Tratamiento' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Tratamiento' })
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
  @ApiResponse({ status: 404, description: 'Tratamiento no encontrado' })
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
    const updated = await this.tratamientoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { tratamiento: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Tratamientos' })
  @ApiResponse({ status: 200, description: 'Lista de Tratamientos' })
  async findAll() {
    const data = await this.tratamientoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Tratamiento por ID' })
  @ApiParam({ name: 'id', description: 'ID del Tratamiento' })
  @ApiResponse({ status: 200, description: 'Tratamiento encontrado' })
  @ApiResponse({ status: 404, description: 'Tratamiento no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.tratamientoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Tratamiento' })
  @ApiParam({ name: 'id', description: 'ID del Tratamiento' })
  @ApiBody({ type: UpdateTratamientoDto })
  @ApiResponse({ status: 200, description: 'Tratamiento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tratamiento no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateTratamientoDto: UpdateTratamientoDto
  ) {
    const data = await this.tratamientoService.update(id, updateTratamientoDto);
    return {
      success: true,
      message: 'Tratamiento actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Tratamiento' })
  @ApiParam({ name: 'id', description: 'ID del Tratamiento' })
  @ApiResponse({ status: 200, description: 'Tratamiento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Tratamiento no encontrado' })
  async remove(@Param('id') id: string) {
    const tratamiento = await this.tratamientoService.findOne(id);
    if (tratamiento.imagen) {
      const filename = tratamiento.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.tratamientoService.remove(id);
    return { success: true, message: 'Tratamiento eliminado exitosamente' };
  }
}
