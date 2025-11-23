import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type MedicoProfileDocument = MedicoProfile & Document;

/**
 * MedicoProfile - Profile de negocio para rol MEDICO
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class MedicoProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreCompleto: string;

  @Prop()
  telefono?: string;

  @Prop()
  especialidad?: string;

  @Prop()
  cmp?: string;

  @Prop()
  consultorio?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const MedicoProfileSchema = SchemaFactory.createForClass(MedicoProfile);

// Indexes para optimizar queries
MedicoProfileSchema.index({ user: 1 });
