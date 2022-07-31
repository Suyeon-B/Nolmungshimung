import React from "react";
import styled from "styled-components";

function SearchBtn({ onClickSearch, searchColor, placeHolder }) {
  return (
    <SideBarBtn onClick={onClickSearch} color={searchColor}>
      <svg
        fill="currentColor"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z" />
      </svg>
      <Fonts>{placeHolder}</Fonts>
      {/* <Fonts>검색</Fonts> */}
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
    props.color === "#ebebeb" ? "inset 2px 4px 4px rgb(0 0 0 / 25%)" : ""}; */
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

export default React.memo(SearchBtn);
