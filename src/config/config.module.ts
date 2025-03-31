import { Module } from "@nestjs/common";
import { ConfigModule as cm } from "@nestjs/config";
import emailConfig from "./email.config";
import { validationSchema } from "./validation-schema";
import dbConfig from "./db.config";

@Module({
  imports: [
    cm.forRoot({
      envFilePath: [`${__dirname}/env/.env.${process.env.NODE_ENV}`],
      load: [ emailConfig, dbConfig ],
      isGlobal: true,
      validationSchema
    })
  ]
})
export class ConfigModule {}