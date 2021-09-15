import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

/** Class handling business logic about emails */
@Injectable()
export class EmailService {
  /**
   * Mail transporter
   * @see Mail
   * @private
   */
  private nodemailerTransport: Mail;

  /** Configure the mail transporter and inject other services */
  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  /** Send an email to a specific email address
   * @param options - The options about the receiver and the content of the mail
   * @see Mail.Options
   * @throws {Error} if the mail cannot be transferred
   */
  async sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
