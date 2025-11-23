import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { Tratamiento, TratamientoDocument } from './schemas/tratamiento.schema';

@Injectable()
export class TratamientoService {
  constructor(
    @InjectModel(Tratamiento.name) private tratamientoModel: Model<TratamientoDocument>,
  ) {}

  async create(createTratamientoDto: CreateTratamientoDto): Promise<Tratamiento> {
    const nuevoTratamiento = await this.tratamientoModel.create(createTratamientoDto);
    return nuevoTratamiento;
  }

  async findAll(): Promise<Tratamiento[]> {
    const tratamientos = await this.tratamientoModel.find();
    return tratamientos;
  }

  async findOne(id: string | number): Promise<Tratamiento> {
    const tratamiento = await this.tratamientoModel.findById(id)
    .populate('paciente', 'nombre email')
    .populate('medico', 'nombre especialidad');
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
    return tratamiento;
  }

  async update(id: string | number, updateTratamientoDto: UpdateTratamientoDto): Promise<Tratamiento> {
    const tratamiento = await this.tratamientoModel.findByIdAndUpdate(id, updateTratamientoDto, { new: true })
    .populate('paciente', 'nombre email')
    .populate('medico', 'nombre especialidad');
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
    return tratamiento;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.tratamientoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
  }
}
