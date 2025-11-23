import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitaMedicaService } from './citamedica.service';
import { CitaMedicaController } from './citamedica.controller';
import { UploadModule } from '../upload/upload.module';
import { CitaMedica, CitaMedicaSchema } from './schemas/citamedica.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CitaMedica.name, schema: CitaMedicaSchema }]),
    UploadModule,
  ],
  controllers: [CitaMedicaController],
  providers: [CitaMedicaService],
  exports: [CitaMedicaService],
})
export class CitaMedicaModule {}
