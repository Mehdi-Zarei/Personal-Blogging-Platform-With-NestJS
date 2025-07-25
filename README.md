<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

![image](https://github.com/Mehdi-Zarei/Personal-Blogging-Platform-With-NestJS/raw/06ca0c668f1dfee6b7c540f61d00b9ccd867ed8e/public/images/article/istockphoto-1341466569-612x612.jpg)

# Virgool-Inspired Blogging Platform (NestJS)

A full-featured blogging platform inspired by [Virgool.io](https://virgool.io), built with NestJS. This backend provides secure authentication, article management, and robust user profile features.

## ✨ Features

- ✅ **NestJS** based modular and scalable architecture
- 📝 **Article Management**
  - Anyone can publish articles
  - Upload cover image via Multer (separate module)
  - Suggested articles mechanism
  - Like and bookmark articles
  - Delete own articles
  - View personal articles in user panel

- 🔐 **Authentication & Authorization**
  - OTP-based login (via Axios to SMS service)
  - Google OAuth2 login
  - Access token (15 minutes) and Refresh token (30 days, hashed in Redis)
  - Logout functionality
  - Regenerate access token with refresh token
  - OTP expires in 120 seconds, stored in Redis
  - Role-based access control with custom decorator (`@Roles()`)
  - AuthGuard developed for protecting authenticated routes

- 👤 **User Features**
  - Upload/delete avatar (old image gets deleted)
  - View profile
  - Admin can ban/unban users
  - Users can remove their avatar completely

- ⚙️ **Admin Features**
  - Create, update, delete categories
  - Pagination for user and article listings

- 🧰 **Utilities and Structure**
  - Multer module implemented separately (like JWT module)
  - SMS service with Axios is a separate module
  - DTOs using `class-validator` and `class-transformer`

## 📦 Dependencies

### Runtime Dependencies

```json
{
  "@nestjs-modules/ioredis": "^2.0.2",
  "@nestjs/axios": "^4.0.0",
  "@nestjs/common": "^11.1.3",
  "@nestjs/core": "^11.1.3",
  "@nestjs/platform-express": "^11.1.3",
  "axios": "^1.10.0",
  "cookie-parser": "^1.4.7",
  "ioredis": "^5.6.1",
  "multer": "^2.0.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.2"
}
```

### Development Dependencies

```json
{
  "@eslint/eslintrc": "^3.3.1",
  "@eslint/js": "^9.30.1",
  "@nestjs/cli": "^11.0.7",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/schematics": "^11.0.5",
  "@nestjs/swagger": "^11.2.0",
  "@nestjs/testing": "^11.1.3",
  "@nestjs/typeorm": "^11.0.0",
  "@swc/cli": "^0.7.8",
  "@swc/core": "^1.12.11",
  "@types/bcrypt": "^5.0.2",
  "@types/cookie-parser": "^1.4.9",
  "@types/express": "^5.0.3",
  "@types/jest": "^30.0.0",
  "@types/multer": "^2.0.0",
  "@types/node": "^24.0.12",
  "@types/passport-google-oauth20": "^2.0.16",
  "@types/supertest": "^6.0.3",
  "bcrypt": "^6.0.0",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.14.2",
  "dotenv": "^17.2.0",
  "eslint": "^9.30.1",
  "eslint-config-prettier": "^10.1.5",
  "eslint-plugin-prettier": "^5.5.1",
  "globals": "^16.3.0",
  "jest": "^30.0.4",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "pg": "^8.16.3",
  "prettier": "^3.6.2",
  "source-map-support": "^0.5.21",
  "supertest": "^7.1.3",
  "swagger-ui-express": "^5.0.1",
  "ts-jest": "^29.4.0",
  "ts-loader": "^9.5.2",
  "ts-node": "^10.9.2",
  "tsconfig-paths": "^4.2.0",
  "typeorm": "^0.3.25",
  "typescript": "^5.8.3",
  "typescript-eslint": "^8.36.0"
}
```

## 📖 Swagger

- Swagger UI is available for API testing and documentation.
- Make sure the project is running to access `http://localhost:3000/swagger`

## 🔐 Security

- Access token and refresh token strategy implemented
- Refresh token is hashed and stored in Redis
- OTPs also stored temporarily in Redis (120s TTL)

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start the application
npm start:dev
```

## 📁 Folder Structure Highlights

- `auth/`: OTP login, Google OAuth2, guards, strategies
- `articles/`: Article CRUD, likes, bookmarks
- `users/`: Avatar, profile, ban/unban
- `common/decorators/`: Role-based access control
- `common/guards/`: AuthGuard for protected routes
- `multer/`: Standalone file upload module
- `sms/`: Axios-based SMS service

## 📌 Notes

- Inspired by Virgool.io
- Designed for scalability and modularity
- Redis used for performance and security enhancements

---

Built with ❤️ using NestJS
