import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente, PacienteDocument } from './schemas/paciente.schema';

@Injectable()
export class PacienteService {
  constructor(
    @InjectModel(Paciente.name) private pacienteModel: Model<PacienteDocument>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const nuevoPaciente = await this.pacienteModel.create(createPacienteDto);
    return nuevoPaciente;
  }

  async findAll(): Promise<Paciente[]> {
    const pacientes = await this.pacienteModel.find().populate('usuario', 'nombre email');
    return pacientes;
  }

  async findOne(id: string | number): Promise<Paciente> {
    const paciente = await this.pacienteModel.findById(id).populate('usuario', 'nombre email');
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: string | number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.pacienteModel.findByIdAndUpdate(id, updatePacienteDto, { new: true }).populate('usuario', 'nombre email');
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.pacienteModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }
}
