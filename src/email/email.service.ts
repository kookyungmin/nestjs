import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/email.config';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(@Inject('NODE_ENV') private readonly nodeEnv: string,
              @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>) {
    console.log("### NODE_ENV >> ", nodeEnv, process.env.GOOGLE_EMAIL, config);
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
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
