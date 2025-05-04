import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.roleService.getRole('user');
    const user = new User();

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    Object.assign(user, { ...createUserDto, password: hashedPassword, role: role });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }
}
