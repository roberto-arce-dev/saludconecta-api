import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MedicoDocument = Medico & Document;

@Schema({ timestamps: true })
export class Medico {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  especialidad?: string;

  @Prop({ unique: true })
  licencia: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const MedicoSchema = SchemaFactory.createForClass(Medico);

MedicoSchema.index({ email: 1 });
MedicoSchema.index({ licencia: 1 });
MedicoSchema.index({ especialidad: 1 });
