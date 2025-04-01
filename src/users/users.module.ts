import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmailService } from "src/email/email.service";
import { EmailModule } from "src/email/email.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { LoggerMiddleware } from "src/middleware/logger.middleware";

@Module({
  imports: [ 
    EmailModule,
    TypeOrmModule.forFeature([ UserEntity ])
  ],
  controllers: [ UsersController ],
  providers: [
    UsersService,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware)
      // .forRoutes('/users')
      // .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes(UsersController)
  }
}