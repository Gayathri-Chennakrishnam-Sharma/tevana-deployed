const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// eslint-disable-next-line no-unused-vars

module.exports = class Email{
  constructor(user, url){
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url,
    this.from = `Team Tevana <${process.env.EMAIL_FROM}>`

  }

  newTransport(){
    if(process.env.NODE_ENV === 'production'){
      //sendgrid
      return nodemailer.createTransport({
        service: 'sendgrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject){
    //sends the actual mail
    //render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
    {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    //define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(){
    await this.send('Welcome','Welcome to the Tevana family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};




