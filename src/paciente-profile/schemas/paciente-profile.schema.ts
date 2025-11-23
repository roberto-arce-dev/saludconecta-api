import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type PacienteProfileDocument = PacienteProfile & Document;

/**
 * PacienteProfile - Profile de negocio para rol PACIENTE
 * Siguiendo el patrón DDD: User maneja auth, Profile maneja datos de negocio
 */
@Schema({ timestamps: true })
export class PacienteProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop()
  telefono?: string;

  @Prop()
  fechaNacimiento?: string;

  @Prop()
  grupoSanguineo?: string;

  @Prop({ type: [String], default: [] })
  alergias?: string[];

  @Prop()
  contactoEmergencia?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PacienteProfileSchema = SchemaFactory.createForClass(PacienteProfile);

// Indexes para optimizar queries
PacienteProfileSchema.index({ user: 1 });
