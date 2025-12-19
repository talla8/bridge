import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

type User = {
  id: number;
  name: string;
  email: string;
  password: string; // رح نخزّن فيها الـ hash
};

@Injectable()
export class AuthService {
  private users: User[] = [];
  private nextId = 1;

  constructor(private readonly jwtService: JwtService) {}

  // -------- REGISTER ----------
  async register(registerDto: RegisterDto) {
    const existing = this.users.find(
      (u) => u.email === registerDto.email,
    );
    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    // نعمل hash للباسورد بدل ما نخزّنه plain
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser: User = {
      id: this.nextId++,
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
    };

    this.users.push(newUser);

    return {
      message: 'User registered successfully (mock)',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }

  // -------- LOGIN ----------
  async login(loginDto: LoginDto) {
    const user = this.users.find(
      (u) => u.email === loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // نقارن الباسورد اللي دخلته بالـ hash المخزَّن
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  }
}
