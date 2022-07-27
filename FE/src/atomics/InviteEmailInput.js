import React from "react";
import styled from "styled-components";
function InviteEmailInput({ onChangeEmail, handleOnKeyPress, email }) {
  // const [email, setEmail] = useState("");

  return (
    <InviteEmailInputTag
      type="text"
      value={email}
      onChange={onChangeEmail}
      onKeyPress={handleOnKeyPress}
    />
  );
}

const InviteEmailInputTag = styled.input`
  width: 60%;
  background: transparent;
  border: 0;
  color: white;
  outline: none;
`;
export default React.memo(InviteEmailInput);
