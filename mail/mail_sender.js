const {setValue} = require('./../redis/redis_connection');
const mailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const {getExpiryTime} = require('../security/expiredTime');

module.exports.AdminLoginSecurity = async function (id, mail, ip,token) {
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,digits: true, lowerCaseAlphabets: false });
  await sendMail(mail, otp);
  await setValue(id, {
      key : otp,
      ipAdress : ip,
      expired_time : getExpiryTime(5)
  },true,token)
};


async function sendMail(mailAdress, otp) {
  const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS
    }
  });

  await transporter.sendMail({
      from: 'Codingo <isik.efe017@gmail.com>',
      to: mailAdress,
      subject: 'Codingo Admin Giriş İşlemi',
      html: `Codingo Admin ~ Giriş Denemesi\nGiriş işlemi için kodunuz : ${otp} \nEğer bu ilemi siz yapmadıysanız lütfen dikkate almayınız!`
  })
}