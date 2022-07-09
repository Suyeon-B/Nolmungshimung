import React, { useState } from "react";

function SignIn() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const onchangeId = (event) => {
    setId(event.target.value);
  };
  const onchangePassword = (event) => {
    setPassword(event.target.value);
  };
  const onSubmitSignUp = (event) => {
    event.preventDefault();
    // console.log(`id :${id}`);
    // console.log(`password :${password}`);
    // signin
    let userForm = {
      userEmail: id,
      userPwd: password,
    };
    fetch("http://localhost:8443/users/signin", {
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
        alt=""
        src="/statics/images/loginTitle.png"
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
              background: "linear-gradient(90deg, #FF7A00 0%, #FFBD80 100%)",
              borderRadius: "30px 0px 0px 30px",
              border: "0",
              fontFamily: "Rounded Mplus 1c Bold",
              fontStyle: "normal",
              fontWeight: " 700",
              fontSize: "20px",
              lineHeight: "45px",
              color: "white",
            }}
          >
            Log in
          </button>
          <button
            style={{
              width: "219px",
              height: "86px",
              background: "#EBEBEB",
              borderRadius: "0px 30px 30px 0px",
              border: "0",
              fontFamily: "Rounded Mplus 1c Bold",
              fontStyle: "normal",
              fontWeight: " 700",
              fontSize: "20px",
              lineHeight: "45px",
              color: "#4A4A4A",
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
              height: "64px",
              borderRadius: "30px",
              background: "#EBEBEB",
              border: "0",
              paddingLeft: "20px",
              marginTop: "15px",
            }}
          />
          <input
            value="로그인"
            type="submit"
            style={{
              width: "440px",
              height: "64px",
              borderRadius: "30px",
              background:
                "linear-gradient(90deg, #FF7A00 0%, #FFA149 50%, #FEBC7F 100%)",
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

export default SignIn;
