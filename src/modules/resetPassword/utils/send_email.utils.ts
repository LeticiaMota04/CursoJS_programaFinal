import nodemailer from 'nodemailer';

export class UtilsSendEmail {
    public static async send(email: string, secret: number) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SEND_EMAIL,
                pass: process.env.SEND_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SEND_EMAIL,
            to: email,
            subject: '[Segurança] Reset sua senha',
            text: `Código de segurança: ${secret}`,
        };
        await transporter.sendMail(mailOptions);
    }
}