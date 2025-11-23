import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicoProfile, MedicoProfileSchema } from './schemas/medico-profile.schema';
import { MedicoProfileService } from './medico-profile.service';
import { MedicoProfileController } from './medico-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicoProfile.name, schema: MedicoProfileSchema },
    ]),
  ],
  controllers: [MedicoProfileController],
  providers: [MedicoProfileService],
  exports: [MedicoProfileService],
})
export class MedicoProfileModule {}
