import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfigInit(app: INestApplication) {
  const document = new DocumentBuilder()
    .setVersion("1.0.0")
    .setTitle("A website's Back-End, similar to Virgool.io")
    .setDescription(
      "This is the backend API for a content publishing platform similar to Medium or Virgool, where users can write, publish, and read articles. The API supports features such as user authentication, article management, comments, tags, likes, bookmarks, and more.",
    )
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "accessToken",
    )
    .build();

  const swaggerDocuments = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("/swagger", app, swaggerDocuments);
}
