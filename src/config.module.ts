import { Module } from "@nestjs/common";
import { ConfigModule as cm } from "@nestjs/config";

@Module({
  imports: [
    cm.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true
    })
  ]
})
export class ConfigModule {}