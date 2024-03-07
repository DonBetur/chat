import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as morgan from 'morgan';

const logStream = fs.createWriteStream('api.log', {
	flags: 'a', // append
});

async function bootstrap() {
	setTimeout(() => {
		console.log(process.env.POSTGRES_HOST, 'process.env.POSTGRES_HOST');
		console.log(process.env.POSTGRES_PORT, 'process.env.POSTGRES_PORT');
		console.log(process.env.POSTGRES_USER, 'process.env.POSTGRES_USER');
		console.log(process.env.POSTGRES_PASSWORD, 'process.env.POSTGRES_PASSWORD');
		console.log(process.env.POSTGRES_DATABASE, 'process.env.POSTGRES_DATABASE');
		console.log(process.env.JWT_SECRET, 'process.env.JWT_SECRET');
		console.log('-');
	}, 1000);
	const app = await NestFactory.create(AppModule);
	//app.enableCors({
	//	origin: 'http://localhost:3000', // Замените на свой фронтенд-домен
	//	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	//	credentials: true,
	//});
	app.enableCors();
	app.setGlobalPrefix('api-chat');
	app.useGlobalPipes(new ValidationPipe());
	app.use(morgan('tiny', { stream: logStream }));
	await app.listen(3000);
}
bootstrap();
