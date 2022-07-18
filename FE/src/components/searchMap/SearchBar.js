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
    setInputText("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
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
        <input
          type="submit"
          id="search.keyword.submit"
          // value={<SearchOutlined />}
          style={{ display: "none" }}
          // style={{ marginLeft: "10px" }}
        />
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
  height: 20px; */
  border-radius: 5px;
  padding-left: 15px;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  outline : none;
  border: 0;
`;
export default SearchBar;
