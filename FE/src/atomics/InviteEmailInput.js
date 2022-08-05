import React from "react";
import styled from "styled-components";
import { UsergroupAddOutlined } from "@ant-design/icons";

function InviteEmailInput({ onChangeEmail, handleOnKeyPress, email, sendInviteEmail }) {
  // const [email, setEmail] = useState("");

  return (
    <InviteForm>
      <InviteEmailText>Email</InviteEmailText>
      {/* 텍스트 -> 이메일로 고쳐야함 */}
      <InviteEmailInputTag type="text" value={email} onChange={onChangeEmail} onKeyPress={handleOnKeyPress} />
      <UsergroupAddOutlined style={{ fontSize: "25px", color: "white" }} onClick={sendInviteEmail} />
    </InviteForm>
  );
}

const InviteForm = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: black;
  width: 80%;
  margin-left: 10%;
  border-radius: 50px;
  background: rgba(27, 25, 25, 0.7);
  border: 0;
  margin-bottom: 20px;
`;

const InviteEmailText = styled.span`
  color: white;
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
`;

const InviteEmailInputTag = styled.input`
  width: 60%;
  background: transparent;
  border: 0;
  color: white;
  outline: none;
`;
export default React.memo(InviteEmailInput);
