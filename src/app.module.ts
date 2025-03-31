import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestUsersModule } from './test/users/users.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ TestUsersModule, ConfigModule, UsersModule ],
  controllers: [ AppController ],
  providers: [ 
    AppService
  ],
})
export class AppModule {}
