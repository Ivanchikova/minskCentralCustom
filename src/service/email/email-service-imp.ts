import { EmailService } from './email-service';
import { Configuration } from '../../configuration/configuration';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import mail from '@sendgrid/mail';

@injectable()
export class EmailServiceImpl implements EmailService {

    constructor(@inject(TYPES.Configuration) private _configuration: Configuration) {
        mail.setApiKey(this._configuration.sendgridApiKey)
    }

    async sendRegisterMail(emailTo: string): Promise<void> {
        const mailOptions = {
            from: this._configuration.emailFrom,
            to: emailTo,
            subject: 'Вы успешно создали аккаунт',
            html: `
<h1>Добро пожаловать в погодное приложение</h1>
<p>Вы успешно создали аккаунт с email -  ${emailTo}</p>
<hr />
<a href='${this._configuration.baseUrl}'>Погодное приложение</a>`
        }


        const info = await mail.send(mailOptions);
        console.log(`EmailServiceImpl: sendRegisterMail ${JSON.stringify(info)}`);
    }

    async sendRestorePasswordMail(emailTo: string, restoreUrl: string): Promise<void> {
        const mailOptions = {
            from: this._configuration.emailFrom,
            to: emailTo,
            subject: 'Восстановение доступа',
            html: `
<h1>Did you forget your password?</h1>
<p>If not, ignore the letter</p>
<p>Otherwise click below:</p>
<p><a href="${restoreUrl}">Restore access</a></p>
<hr />
<a href=${this._configuration.baseUrl}>Погодное приложение</a>`
        };

        const info = await mail.send(mailOptions);
        console.log(`EmailServiceImpl: sendRegisterMail ${JSON.stringify(info)}`);
    }
}