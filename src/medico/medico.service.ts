import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { Medico, MedicoDocument } from './schemas/medico.schema';

@Injectable()
export class MedicoService {
  constructor(
    @InjectModel(Medico.name) private medicoModel: Model<MedicoDocument>,
  ) {}

  async create(createMedicoDto: CreateMedicoDto): Promise<Medico> {
    const nuevoMedico = await this.medicoModel.create(createMedicoDto);
    return nuevoMedico;
  }

  async findAll(): Promise<Medico[]> {
    const medicos = await this.medicoModel.find().populate('usuario', 'nombre email');
    return medicos;
  }

  async findOne(id: string | number): Promise<Medico> {
    const medico = await this.medicoModel.findById(id).populate('usuario', 'nombre email');
    if (!medico) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
    return medico;
  }

  async update(id: string | number, updateMedicoDto: UpdateMedicoDto): Promise<Medico> {
    const medico = await this.medicoModel.findByIdAndUpdate(id, updateMedicoDto, { new: true }).populate('usuario', 'nombre email');
    if (!medico) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
    return medico;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.medicoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
  }

  // Métodos EP3 agregados
  async findDisponibles(): Promise<Medico[]> {
    return this.medicoModel.find({ 
      disponible: true,
      activo: true 
    })
    .populate('usuario', 'nombre email')
    .sort({ especialidad: 1, nombre: 1 })
    .exec();
  }

  async findByEspecialidad(especialidad: string): Promise<Medico[]> {
    return this.medicoModel.find({ 
      especialidad: { $regex: especialidad, $options: 'i' },
      activo: true 
    })
    .populate('usuario', 'nombre email')
    .sort({ nombre: 1 })
    .exec();
  }

  async buscarMedicos(termino: string): Promise<Medico[]> {
    const regex = { $regex: termino, $options: 'i' };
    return this.medicoModel.find({
      $or: [
        { nombre: regex },
        { especialidad: regex },
        { descripcion: regex }
      ],
      activo: true
    })
    .populate('usuario', 'nombre email')
    .sort({ nombre: 1 })
    .exec();
  }
}
