import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { swaggerConfigInit } from "./config/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);

  const { PORT } = process.env;
  await app.listen(PORT ?? 4000, () => {
    console.log(`🚀 Server is up and running at localhost:${PORT ?? 4000}`);
    console.log(`🚀 Swagger Documents: http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
