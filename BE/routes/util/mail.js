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

exports.inviteMail = function (email, inviteToken) {
  return new Promise(async (resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER, //username
        pass: process.env.NODEMAILER_PASS, //password
      },
    });

    //메일에 넣을 초대링크 주소
    const url = `https://${process.env.REACT_APP_SERVER_IP}:3000/invite/?token=${inviteToken}`;

    const message = {
      from: "nolmong@gmail.com", //process.env.NODEMAILER_USER, // sender address
      to: `${email}`, // list of receivers
      subject: "놀멍쉬멍 프로젝트 초대 메일입니다.", // Subject line
      html:
        "<p>아래 링크를 누르면 그룹으로 초대됩니다.</p>" +
        "<a href=" +
        url +
        ">초대링크</a>",
    };

    // 메일 전송
    transporter.sendMail(message, (error) => {
      if (error) {
        console.log(error);
        resolve(false);
      } else resolve(true);
    });
  });
};
