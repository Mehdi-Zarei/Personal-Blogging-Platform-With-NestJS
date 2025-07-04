import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { swaggerConfigInit } from "./config/swagger.config";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET)); //todo
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, "..", "public"));
  swaggerConfigInit(app);

  const { PORT } = process.env;
  await app.listen(PORT ?? 4000, () => {
    console.log(`🚀 Server is up and running at localhost:${PORT ?? 4000}`);
    console.log(`🚀 Swagger Documents: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
