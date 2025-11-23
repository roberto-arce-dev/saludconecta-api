import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HistorialClinicoDocument = HistorialClinico & Document;

@Schema({ timestamps: true })
export class HistorialClinico {
  @Prop({ type: Types.ObjectId, ref: 'Paciente', required: true,  unique: true  })
  paciente: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  alergias?: any;

  @Prop({ type: [String], default: [] })
  enfermedadesCronicas?: any;

  @Prop({ type: [String], default: [] })
  cirugias?: any;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const HistorialClinicoSchema = SchemaFactory.createForClass(HistorialClinico);

HistorialClinicoSchema.index({ paciente: 1 });
