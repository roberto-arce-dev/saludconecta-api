import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TratamientoService } from './tratamiento.service';
import { TratamientoController } from './tratamiento.controller';
import { UploadModule } from '../upload/upload.module';
import { Tratamiento, TratamientoSchema } from './schemas/tratamiento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tratamiento.name, schema: TratamientoSchema }]),
    UploadModule,
  ],
  controllers: [TratamientoController],
  providers: [TratamientoService],
  exports: [TratamientoService],
})
export class TratamientoModule {}
