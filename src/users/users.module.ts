import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmailService } from "src/email/email.service";

@Module({
  controllers: [ UsersController ],
  providers: [
    UsersService,
    EmailService,
    { provide: 'NODE_ENV', useValue: process.env.NODE_ENV },
  ],
})
export class UsersModule {}