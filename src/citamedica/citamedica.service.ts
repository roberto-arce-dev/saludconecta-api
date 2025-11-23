import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCitaMedicaDto } from './dto/create-citamedica.dto';
import { UpdateCitaMedicaDto } from './dto/update-citamedica.dto';
import { CitaMedica, CitaMedicaDocument } from './schemas/citamedica.schema';

@Injectable()
export class CitaMedicaService {
  constructor(
    @InjectModel(CitaMedica.name) private citamedicaModel: Model<CitaMedicaDocument>,
  ) {}

  async create(createCitaMedicaDto: CreateCitaMedicaDto): Promise<CitaMedica> {
    const nuevoCitaMedica = await this.citamedicaModel.create(createCitaMedicaDto);
    return nuevoCitaMedica;
  }

  async findAll(): Promise<CitaMedica[]> {
    const citamedicas = await this.citamedicaModel.find();
    return citamedicas;
  }

  async findOne(id: string | number): Promise<CitaMedica> {
    const citamedica = await this.citamedicaModel.findById(id)
    .populate('paciente', 'nombre email telefono')
    .populate('medico', 'nombre especialidad');
    if (!citamedica) {
      throw new NotFoundException(`CitaMedica con ID ${id} no encontrado`);
    }
    return citamedica;
  }

  async update(id: string | number, updateCitaMedicaDto: UpdateCitaMedicaDto): Promise<CitaMedica> {
    const citamedica = await this.citamedicaModel.findByIdAndUpdate(id, updateCitaMedicaDto, { new: true })
    .populate('paciente', 'nombre email telefono')
    .populate('medico', 'nombre especialidad');
    if (!citamedica) {
      throw new NotFoundException(`CitaMedica con ID ${id} no encontrado`);
    }
    return citamedica;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.citamedicaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`CitaMedica con ID ${id} no encontrado`);
    }
  }
}
