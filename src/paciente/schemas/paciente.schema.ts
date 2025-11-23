import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PacienteDocument = Paciente & Document;

@Schema({ timestamps: true })
export class Paciente {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop()
  fechaNacimiento?: Date;

  @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
  grupoSanguineo?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PacienteSchema = SchemaFactory.createForClass(Paciente);

PacienteSchema.index({ email: 1 });
