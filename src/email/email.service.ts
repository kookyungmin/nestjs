import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(@Inject('NODE_ENV') private readonly nodeEnv: string) {
    console.log("### NODE_ENV >> ", nodeEnv);
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process .env.GOOGLE_PASS
      }
    })
  }

  async sendMemberJoinVerification(email: string, signupVerifyToken: string) {
    const baseUrl: string = 'http://localhost:3000';
    const url: string = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: '가입 인증 메일',
      html: `메일 인증 확인 <br> 
        <form action="${url}" method="POST">
          <button>확인</button>
        </form>`
    }

    return await this.transporter.sendMail(mailOptions);
  }
}
