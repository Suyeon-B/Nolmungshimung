const nodemailer = require("nodemailer");
const config_mail = require(__base + "secure_mail.json");
const Project = require(__base + "models/Project");

exports.signupMail = function (certificationNumber, receive) {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport(config_mail);

    let message = {
      from: "<tonguek8@gmail.com>",
      to: receive,
      subject: "놀멍 쉬멍 회원가입 안내",
      html: `<div style="width : 550px; height : 700px; text-align: center;">
      <h1>WelCome 놀멍쉬멍</h1>
      <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb9TqMa%2FbtrIkowSQj7%2F4MgsPytZRxkgN8NrgUejvK%2Fimg.png" style="width :547px; height : 300px" />
      <h2>회원가입해주셔서 감사합니다.</h2>
      <h3>아래 인증번호를 입력해주세요.</h3>
      <h2>인증코드 : ${certificationNumber}</h2>
    </div>`,
      // html: `<div>회원가입을 해주셔서 감사합니다. <br/>회원가입을 위해서 아래 인증번호를 입력해주세요. <br/></div><h1>${certificationNumber}</h1>`,
    };
    transporter.sendMail(message, (error) => {
      if (error) {
        console.log(error);
        resolve(false);
      } else resolve(true);
    });
  });
};

exports.inviteMail = function (email, inviteToken, projectId) {
  // console.log(email, inviteToken);
  return new Promise(async (resolve, reject) => {
    const project = await Project.findById(projectId);
    const projectName = project.project_title;
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
    const url = `https://nolmungshimung.vercel.app/invite/?token=${inviteToken}`;

    const message = {
      from: process.env.NODEMAILER_USER, // sender address
      to: `${email}`, // list of receivers
      subject: "놀멍쉬멍 여행일정 초대 메일입니다.", // Subject line
      html: `<div style="width : 550px; height : 700px; text-align: center;">
      <h1>WelCome 놀멍쉬멍</h1>
      <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb9TqMa%2FbtrIkowSQj7%2F4MgsPytZRxkgN8NrgUejvK%2Fimg.png" style="width :547px; height : 300px" />
      <h2>"${projectName}" 여행일정에서 당신을 초대하였습니다.</h2>
      <h2>초대링크 : <a href=${url}>바로가기</a></h2>
    </div>`,
      // html:
      //   "<p>아래 링크를 누르면 그룹으로 초대됩니다.</p>" +
      //   "<a href=" +
      //   url +
      //   ">초대링크</a>",
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
