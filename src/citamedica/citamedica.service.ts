import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCitaMedicaDto } from './dto/create-citamedica.dto';
import { UpdateCitaMedicaDto } from './dto/update-citamedica.dto';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
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

  // Métodos EP3 agregados
  async findByPaciente(pacienteId: string): Promise<CitaMedica[]> {
    return this.citamedicaModel.find({ paciente: new Types.ObjectId(pacienteId) })
      .populate('paciente', 'nombre email telefono')
      .populate('medico', 'nombre especialidad')
      .sort({ fecha: -1 })
      .exec();
  }

  async findByMedico(medicoId: string): Promise<CitaMedica[]> {
    return this.citamedicaModel.find({ medico: new Types.ObjectId(medicoId) })
      .populate('paciente', 'nombre email telefono')
      .populate('medico', 'nombre especialidad')
      .sort({ fecha: -1 })
      .exec();
  }

  async agendarCita(agendarCitaDto: AgendarCitaDto): Promise<CitaMedica> {
    const nuevaCita = await this.citamedicaModel.create({
      paciente: new Types.ObjectId(agendarCitaDto.pacienteId),
      medico: new Types.ObjectId(agendarCitaDto.medicoId),
      fecha: new Date(agendarCitaDto.fechaCita),
      motivoConsulta: agendarCitaDto.motivoConsulta,
      estado: 'programada',
      fechaCreacion: new Date(),
      nombre: `Cita - ${agendarCitaDto.motivoConsulta}`
    });
    return nuevaCita.populate(['paciente', 'medico']);
  }

  async getProximasCitas(pacienteId: string): Promise<CitaMedica[]> {
    const fechaActual = new Date();
    return this.citamedicaModel.find({
      paciente: new Types.ObjectId(pacienteId),
      fecha: { $gte: fechaActual },
      estado: { $in: ['programada', 'confirmada'] }
    })
    .populate('medico', 'nombre especialidad')
    .sort({ fecha: 1 })
    .exec();
  }
}
