import React, { useState } from "react";
import styled from "styled-components";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = (props) => {
  const [InputText, setInputText] = useState("");

  const onChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.changePlace(InputText);
    // setInputText("");
    props.handleSelect(null);
    props.sumit(!props.current);
    props.setSwLatlng([33.592161526546604, 126.04650255976554]);
    props.setNeLatlng([33.14572269165777, 127.07480227781775]);
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "54px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "3px 3px 3px 0px lightgray",
        paddingBottom: "18px",
      }}
      autoComplete="off"
    >
      <StyledFieldset>
        <SearchOutlined style={{ fontSize: "25px", color: "#FF8A3D" }} />
        <StyledInput
          type="text"
          id="search.keyword.query"
          name="q"
          // class="query tf_keyword bg_on"
          maxlength="100"
          autocomplete="off"
          accesskey="s"
          onChange={onChange}
          value={InputText}
        />
        <input type="submit" id="search.keyword.submit" style={{ display: "none" }} />
      </StyledFieldset>
    </form>
  );
};

// const StyledInput = styled.input`
const StyledFieldset = styled.fieldset`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-radius: 5px;
  padding-left: 15px;
  border: 3px solid #ff8a3d;
  width: 85%;
  padding: 8px;
`;
const StyledInput = styled.input`
  height: 20px;
  border-radius: 5px;
  padding-left: 15px;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  outline: none;
  border: 0;
`;
export default React.memo(SearchBar);
