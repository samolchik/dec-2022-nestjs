import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarRequestDto } from './dto/request/create-car.request.dto';
import { UpdateCarRequestDto } from './dto/request/update-car.request.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post(':userId')
  async createCar(
    @Body() body: CreateCarRequestDto,
    @Param('userId') userId: string,
  ) {
    return this.carService.createCar(body, userId);
  }

  @Get(':carId')
  async getCarWithDrivers(@Param('carId') carId: string) {
    return this.carService.getCarWithDrivers(carId);
  }
  @Patch(':carId')
  async updateCarProfile(
    @Param('carId') carId: string,
    @Body() body: UpdateCarRequestDto,
  ) {
    return this.carService.updateCarProfile(carId, body);
  }

  @Delete(':carId')
  async deleteCar(@Param('carId') carId: string) {
    await this.carService.deleteCarProfile(carId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Car deleted successfully',
    };
  }
}
