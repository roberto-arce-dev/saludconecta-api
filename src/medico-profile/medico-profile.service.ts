import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicoProfile, MedicoProfileDocument } from './schemas/medico-profile.schema';
import { CreateMedicoProfileDto } from './dto/create-medico-profile.dto';
import { UpdateMedicoProfileDto } from './dto/update-medico-profile.dto';

@Injectable()
export class MedicoProfileService {
  constructor(
    @InjectModel(MedicoProfile.name) private medicoprofileModel: Model<MedicoProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateMedicoProfileDto): Promise<MedicoProfile> {
    const profile = await this.medicoprofileModel.create({
      user: userId,
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<MedicoProfile | null> {
    return this.medicoprofileModel.findOne({ user: userId }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<MedicoProfile[]> {
    return this.medicoprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateMedicoProfileDto): Promise<MedicoProfile> {
    const profile = await this.medicoprofileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.medicoprofileModel.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}
