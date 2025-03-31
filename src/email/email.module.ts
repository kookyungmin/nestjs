import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";

@Module({
  providers: [ 
    EmailService, 
    { provide: 'NODE_ENV', useValue: process.env.NODE_ENV }, 
  ],
  exports: [ EmailService ]
})
export class EmailModule {}