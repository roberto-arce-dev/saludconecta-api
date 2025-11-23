import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';
import { UploadModule } from '../upload/upload.module';
import { Medico, MedicoSchema } from './schemas/medico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medico.name, schema: MedicoSchema }]),
    UploadModule,
  ],
  controllers: [MedicoController],
  providers: [MedicoService],
  exports: [MedicoService],
})
export class MedicoModule {}
