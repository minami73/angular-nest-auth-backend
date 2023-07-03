import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, RegisterUserDto, LoginDto, UpdateAuthDto } from './dto';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

	constructor(
		@InjectModel(User.name)
		private userModel: Model<User>,
		private jwtService: JwtService
	) { }

	async create(createUserDto: CreateUserDto): Promise<User> {

		try {

			// 1 - Encriptar la contraseña
			const { password, ...userData } = createUserDto;

			const newUser = new this.userModel({
				password: bcryptjs.hashSync(password, 10),
				...userData
			});

			// 2 - Guardar el usuario
			// 3 - Generar el JWT

			await newUser.save();
			const { password: _, ...user } = newUser.toJSON();

			return user;

		} catch (error) {
			if (error.code === 11000) {
				throw new BadRequestException(`${createUserDto.email} already exists!`);
			}

			throw new InternalServerErrorException('Something terrible happened!!!');
		}
	}

	async login(loginDto: LoginDto): Promise<LoginResponse> {

		const { email, password } = loginDto;

		const user = await this.userModel.findOne({ email });

		if (!user) {
			throw new UnauthorizedException('Not valid credentials - email');
		}

		if (!bcryptjs.compareSync(password, user.password)) {
			throw new UnauthorizedException('Not valid credentials - password');

		}

		const { password: _, ...rest } = user.toJSON();

		return {
			user: rest, token: this.getJwtToken({ id: user.id }),
		}

		// User { _id, name, email, roles }
		// JWT - Es un estándar para mantener autenticados a nuestros usuarios de forma pasiva
		// Es el que debe de proporcionar el usuario para llegar a un endpoint que pide autenticación
	}

	async register(registerUserDto: RegisterUserDto): Promise<LoginResponse> {

		const user = await this.create(registerUserDto);

		return {
			user: user,
			token: this.getJwtToken({ id: user._id })
		}
	}

	// Autenticación es verificar un usuario y la autorización es si un usuario autenticado tiene permisos
	findAll(): Promise<User[]> {
		return this.userModel.find();
	}

	async findUserById(id: string) {
		const user = await this.userModel.findById(id);
		const { password, ...rest } = user.toJSON();
		return rest;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}

	getJwtToken(payload: JwtPayload) {
		const token = this.jwtService.sign(payload);
		return token;
	}
}
