import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { User } from '../user/user.entity';
import { CreateCarRequestDto } from './dto/request/create-car.request.dto';
import { UpdateCarRequestDto } from './dto/request/update-car.request.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCar(data: CreateCarRequestDto, userId: string): Promise<Car> {
    const user = await this.userRepository.findOneBy({ id: +userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newCar = this.carRepository.create({ ...data, users: [user] });

    return await this.carRepository.save(newCar);
  }

  async updateCarProfile(
    carId: string,
    data: UpdateCarRequestDto,
  ): Promise<UpdateCarRequestDto> {
    const findCar = await this.carRepository.findOne({
      where: { id: +carId },
    });

    if (!findCar) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    await this.carRepository.update(
      { id: +carId },
      {
        age: data.age,
      },
    );

    return data;
  }

  async getCarWithDrivers(carId: string): Promise<Car> {
    return await this.carRepository.findOne({
      where: { id: +carId },
      relations: { users: true },
    });
  }

  async deleteCarProfile(carId: string): Promise<void> {
    const car = await this.carRepository.findOne({
      where: { id: +carId },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    await this.carRepository.remove(car);
  }
}
