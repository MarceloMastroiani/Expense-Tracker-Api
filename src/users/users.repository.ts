import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/helpers/hash-password.utils';

@Injectable()
export class UserRepository extends PrismaService {
  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const passwordHash = await hashPassword(password);

    const newUser = await this.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  async findAllUsers() {
    return this.user.findMany();
  }

  async findOneUser(id: string) {
    return this.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneUserByUsername(username: string) {
    return this.user.findFirst({
      where: {
        name: username,
      },
    });
  }
}
