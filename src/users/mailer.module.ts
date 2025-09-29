import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'restauranterandomnoreply@gmail.com', // mete o teu email
                    pass: 'ydvu cmkv apwf hljt', // mete a tua app password
                },
            },
            defaults: {
                from: '"Random Restaurant" <restauranterandomnoreply@gmail.com>',
            },
        }),
    ],
    exports: [MailerModule],
})
export class MailConfigModule { }
