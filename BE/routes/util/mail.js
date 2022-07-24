const nodemailer = require("nodemailer");
const config_mail = require(__base + "secure_mail.json");

exports.signupMail = function (certificationNumber, receive) {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport(config_mail);

    let message = {
      from: "<tonguek8@gmail.com>",
      to: receive,
      subject: "놀멍 쉬멍 회원가입 안내",
      html: `<div>회원가입을 해주셔서 감사합니다. <br/>회원가입을 위해서 아래 인증번호를 입력해주세요. <br/></div><h1>${certificationNumber}</h1>`,
    };
    transporter.sendMail(message, (error) => {
      if (error) {
        console.log(error);
        resolve(false);
      } else resolve(true);
    });
  });
};
