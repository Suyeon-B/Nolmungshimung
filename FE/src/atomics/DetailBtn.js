import React from "react";
import styled from "styled-components";

function DetailBtn({ onClickDetail, detailColor, placeHolder }) {
  return (
    <SideBarBtn onClick={onClickDetail} color={detailColor}>
      <svg
        fill="currentColor"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path d="M160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32zM0 192H448V464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192zM80 256C71.16 256 64 263.2 64 272V368C64 376.8 71.16 384 80 384H176C184.8 384 192 376.8 192 368V272C192 263.2 184.8 256 176 256H80z" />
      </svg>
      <Fonts>{placeHolder}</Fonts>
    </SideBarBtn>
  );
}

const NoneStyleBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
  cursor: pointer;
  .left_toggle_arrow {
    margin-bottom: 7px;
  }
`;
const Fonts = styled.div`
  margin-left: 10px;
  margin-top: 3px;
`;
const SideBarBtn = styled(NoneStyleBtn)`
  border-top: 2px solid #ebebeb;
  border-bottom: 2px solid #ebebeb;
  width: 50%;
  height: 100%;
  /* border: ${(props) =>
    props.color === "#ebebeb" ? "3px solid #7C828A" : ""}; */
  box-shadow: ${(props) =>
    props.color === "#ebebeb" ? "inset 2px 4px 4px rgb(0 0 0 / 25%)" : ""};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 42px;
  color: #7c8289;
  background-color: ${(props) => `${props.color}`};
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default React.memo(DetailBtn);
