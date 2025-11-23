import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { UploadModule } from '../upload/upload.module';
import { Paciente, PacienteSchema } from './schemas/paciente.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paciente.name, schema: PacienteSchema }]),
    UploadModule,
  ],
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [PacienteService],
})
export class PacienteModule {}
