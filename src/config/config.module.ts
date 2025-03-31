import { Module } from "@nestjs/common";
import { ConfigModule as cm } from "@nestjs/config";
import emailConfig from "./email.config";
import { validationSchema } from "./validation-schema";

@Module({
  imports: [
    cm.forRoot({
      envFilePath: [`${__dirname}/env/.env.${process.env.NODE_ENV}`],
      load: [ emailConfig ],
      isGlobal: true,
      validationSchema
    })
  ]
})
export class ConfigModule {}