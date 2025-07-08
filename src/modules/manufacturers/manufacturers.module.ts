import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { HttpModule } from '@nestjs/axios';
import { ManufacturersMapper } from './mapper/manufacturers.mapper';

@Module({
  imports: [HttpModule],
  controllers: [ManufacturersController],
  providers: [ManufacturersService, ManufacturersMapper],
})
export class ManufacturersModule {}
