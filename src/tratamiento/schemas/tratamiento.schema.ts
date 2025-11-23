import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TratamientoDocument = Tratamiento & Document;

@Schema({ timestamps: true })
export class Tratamiento {
  @Prop({ type: Types.ObjectId, ref: 'Paciente', required: true })
  paciente: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Medico', required: true })
  medico: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  medicamentos?: any;

  @Prop()
  indicaciones?: string;

  @Prop({ default: Date.now })
  fechaInicio?: Date;

  @Prop()
  fechaFin?: Date;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const TratamientoSchema = SchemaFactory.createForClass(Tratamiento);

TratamientoSchema.index({ paciente: 1 });
TratamientoSchema.index({ medico: 1 });
TratamientoSchema.index({ fechaInicio: -1 });
