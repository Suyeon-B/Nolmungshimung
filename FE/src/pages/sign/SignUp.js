import React, { useState } from "react";

function SignUp() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onchangeId = (event) => {
    setId(event.target.value);
  };
  const onchangeName = (event) => {
    setName(event.target.value);
  };
  const onchangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onchangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const onSubmitSignUp = (event) => {
    if (password !== confirmPassword) {
      alert("비밀번호 똑바로 ㅇㅂ력해라");
    }
    event.preventDefault();

    let userForm = {
      userEmail: id,
      userNickName: name,
      userPwd: password,
    };
    console.log(`id : ${id}`);
    console.log(`name : ${name}`);
    console.log(`password : ${password}`);

    fetch("http://localhost:8443/users/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userForm),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res : ", res);
        // if (res.success === true) {
        //   console.log("Sign Up Success");
        //   // window.location.href = /
        // }
      })
      .catch((err) => console.log(`err: ${err}`));
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/statics/images/signUpBackground.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="/statics/images/signUpTitle.png"
        style={{
          width: "457.78px",
          height: "175.58px",
          position: "relative",
          top: "20px",
        }}
      />
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          width: "504px",
          height: "577px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          position: "relative",
        }}
      >
        <section style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              width: "219px",
              height: "86px",
              background: "#EBEBEB",
              borderRadius: "30px 0px 0px 30px",
              border: "0",
              fontFamily: "Rounded Mplus 1c Bold",
              fontStyle: "normal",
              fontWeight: " 700",
              fontSize: "20px",
              lineHeight: "45px",
              color: "#4A4A4A",
            }}
          >
            Log in
          </button>
          <button
            style={{
              width: "219px",
              height: "86px",
              background: "linear-gradient(90deg, #BDE5FF 0%, #41C0FF 100%)",
              borderRadius: "0px 30px 30px 0px",
              border: "0",
              fontFamily: "Rounded Mplus 1c Bold",
              fontStyle: "normal",
              fontWeight: " 700",
              fontSize: "20px",
              lineHeight: "45px",
              color: "white",
            }}
          >
            Sign Up
          </button>
        </section>
        <form
          onSubmit={onSubmitSignUp}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <input
            placeholder="jeju@island.com"
            type="text"
            value={id}
            onChange={onchangeId}
            required
            style={{
              width: "420px",
              height: "64px",
              borderRadius: "30px",
              background: "#EBEBEB",
              border: "0",
              paddingLeft: "20px",
            }}
          />
          <input
            placeholder="이름"
            type="text"
            value={name}
            onChange={onchangeName}
            required
            style={{
              width: "420px",
              paddingLeft: "20px",
              height: "64px",
              borderRadius: "30px",
              background: "#EBEBEB",
              border: "0",
              marginTop: "15px",
            }}
          />
          <input
            placeholder="password"
            type="pass"
            value={password}
            onChange={onchangePassword}
            required
            style={{
              width: "420px",
              paddingLeft: "20px",
              height: "64px",
              borderRadius: "30px",
              background: "#EBEBEB",
              border: "0",
              marginTop: "15px",
            }}
          />
          <input
            placeholder="password 확인"
            type="pass"
            value={confirmPassword}
            onChange={onchangeConfirmPassword}
            required
            style={{
              width: "420px",
              paddingLeft: "20px",
              height: "64px",
              borderRadius: "30px",
              background: "#EBEBEB",
              border: "0",
              marginTop: "15px",
            }}
          />
          <input
            value="회원가입"
            type="submit"
            style={{
              width: "440px",
              height: "64px",
              borderRadius: "30px",
              background:
                "linear-gradient(90deg, #47B5FF 0%, #7ECBFF 50%, #B3E0FF 100%)",
              border: "0",
              fontFamily: "Rounded Mplus 1c Bold",
              fontStyle: "normal",
              fontWeight: " 700",
              fontSize: "20px",
              lineHeight: "45px",
              color: "white",
              marginTop: "15px",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default SignUp;
