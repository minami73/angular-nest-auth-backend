import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	// Le estamos diciendo al backend que sea super estricto
	// Tengo que mandar la información como espero, sino, la rechazo
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);


	// El operador ?? devuelve el valor del lado derecho si el valor del lado izquierdo es nulo o undefined
	// Y viceversa, entonces como no encuentra el puerto en env regresa el 3000
	// Pero al subirlo a prod va a tomar el valor de la izq
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

