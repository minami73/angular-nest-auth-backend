// La info que se manda desde el front al back, lo atrapa el dto

import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;

}
