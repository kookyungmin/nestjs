import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestUsersModule } from './test/users/users.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ TestUsersModule, ConfigModule, DbModule, UsersModule ],
  controllers: [ AppController ],
  providers: [ 
    AppService
  ],
})
export class AppModule {}
