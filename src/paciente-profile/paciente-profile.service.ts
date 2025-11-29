import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PacienteProfile, PacienteProfileDocument } from './schemas/paciente-profile.schema';
import { CreatePacienteProfileDto } from './dto/create-paciente-profile.dto';
import { UpdatePacienteProfileDto } from './dto/update-paciente-profile.dto';

@Injectable()
export class PacienteProfileService {
  constructor(
    @InjectModel(PacienteProfile.name) private pacienteprofileModel: Model<PacienteProfileDocument>,
  ) {}

  async create(userId: string, dto: CreatePacienteProfileDto): Promise<PacienteProfile> {
    const profile = await this.pacienteprofileModel.create({
      user: new Types.ObjectId(userId),
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<PacienteProfile | null> {
    return this.pacienteprofileModel.findOne({ user: new Types.ObjectId(userId) }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<PacienteProfile[]> {
    return this.pacienteprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdatePacienteProfileDto): Promise<PacienteProfile> {
    const profile = await this.pacienteprofileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.pacienteprofileModel.deleteOne({ user: new Types.ObjectId(userId) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}
