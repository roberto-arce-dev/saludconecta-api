import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHistorialClinicoDto } from './dto/create-historialclinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historialclinico.dto';
import { HistorialClinico, HistorialClinicoDocument } from './schemas/historialclinico.schema';

@Injectable()
export class HistorialClinicoService {
  constructor(
    @InjectModel(HistorialClinico.name) private historialclinicoModel: Model<HistorialClinicoDocument>,
  ) {}

  async create(createHistorialClinicoDto: CreateHistorialClinicoDto): Promise<HistorialClinico> {
    const nuevoHistorialClinico = await this.historialclinicoModel.create(createHistorialClinicoDto);
    return nuevoHistorialClinico;
  }

  async findAll(): Promise<HistorialClinico[]> {
    const historialclinicos = await this.historialclinicoModel.find();
    return historialclinicos;
  }

  async findOne(id: string | number): Promise<HistorialClinico> {
    const historialclinico = await this.historialclinicoModel.findById(id)
    .populate('paciente', 'nombre email grupoSanguineo');
    if (!historialclinico) {
      throw new NotFoundException(`HistorialClinico con ID ${id} no encontrado`);
    }
    return historialclinico;
  }

  async update(id: string | number, updateHistorialClinicoDto: UpdateHistorialClinicoDto): Promise<HistorialClinico> {
    const historialclinico = await this.historialclinicoModel.findByIdAndUpdate(id, updateHistorialClinicoDto, { new: true })
    .populate('paciente', 'nombre email grupoSanguineo');
    if (!historialclinico) {
      throw new NotFoundException(`HistorialClinico con ID ${id} no encontrado`);
    }
    return historialclinico;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.historialclinicoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`HistorialClinico con ID ${id} no encontrado`);
    }
  }
}
