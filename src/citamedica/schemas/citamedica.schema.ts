import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CitaMedicaDocument = CitaMedica & Document;

@Schema({ timestamps: true })
export class CitaMedica {
  @Prop({ type: Types.ObjectId, ref: 'Paciente', required: true })
  paciente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Medico', required: true })
  medico: Types.ObjectId;

  @Prop({ required: true })
  fecha: Date;

  @Prop()
  hora?: string;

  @Prop()
  motivo?: string;

  @Prop()
  diagnostico?: string;

  @Prop({ enum: ['programada', 'completada', 'cancelada'], default: 'programada' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const CitaMedicaSchema = SchemaFactory.createForClass(CitaMedica);

CitaMedicaSchema.index({ paciente: 1 });
CitaMedicaSchema.index({ medico: 1 });
CitaMedicaSchema.index({ fecha: 1 });
CitaMedicaSchema.index({ estado: 1 });
