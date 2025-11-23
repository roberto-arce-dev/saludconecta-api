import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialClinicoService } from './historialclinico.service';
import { HistorialClinicoController } from './historialclinico.controller';
import { UploadModule } from '../upload/upload.module';
import { HistorialClinico, HistorialClinicoSchema } from './schemas/historialclinico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HistorialClinico.name, schema: HistorialClinicoSchema }]),
    UploadModule,
  ],
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService],
  exports: [HistorialClinicoService],
})
export class HistorialClinicoModule {}
