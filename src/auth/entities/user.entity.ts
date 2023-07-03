// Esto es el modelo de como va a lucir en la BD (un esquema en Mongo)
// Es decir, las entidades van a representar como van a lucir los objetos en Mongo

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

	_id?: string; // (lo crea mongo por defecto)

	@Prop({ required: true })
	name: string;

	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ minlength: 6, required: true })
	password?: string;

	@Prop({ default: true })
	isActive: boolean;

	@Prop({ type: [String], default: ['user'] })
	roles: string[]

}

export const UserSchema = SchemaFactory.createForClass(User);
