import React from "react";
import styled from "styled-components";

function ButtonGo(props) {
  return <Button onClick={props.onClickGo}>🍊{props.name}</Button>;
}

const Button = styled.button`
  padding-top: 30%;
  padding-bottom: 30%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d9d9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: 0;
  cursor: pointer;
  font-family: "Rounded Mplus 1c Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 48px;
  text-align: center;
  display: block;
  color: #383838;
  word-break: break-word;
`;

export default React.memo(ButtonGo);
