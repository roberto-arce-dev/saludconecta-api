import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PacienteProfile, PacienteProfileSchema } from './schemas/paciente-profile.schema';
import { PacienteProfileService } from './paciente-profile.service';
import { PacienteProfileController } from './paciente-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PacienteProfile.name, schema: PacienteProfileSchema },
    ]),
  ],
  controllers: [PacienteProfileController],
  providers: [PacienteProfileService],
  exports: [PacienteProfileService],
})
export class PacienteProfileModule {}
