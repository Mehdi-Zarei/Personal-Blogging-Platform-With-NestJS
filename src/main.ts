import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { swaggerConfigInit } from "./config/swagger.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET)); //todo
  swaggerConfigInit(app);

  const { PORT } = process.env;
  await app.listen(PORT ?? 4000, () => {
    console.log(`🚀 Server is up and running at localhost:${PORT ?? 4000}`);
    console.log(`🚀 Swagger Documents: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
