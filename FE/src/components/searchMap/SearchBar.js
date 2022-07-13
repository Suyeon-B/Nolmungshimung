import React, { useState } from "react";
import styled from "styled-components";

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
    <form onSubmit={handleSubmit}>
      <fieldset>
        <StyledInput
          type="text"
          id="search.keyword.query"
          name="q"
          class="query tf_keyword bg_on"
          maxlength="100"
          autocomplete="off"
          accesskey="s"
          onChange={onChange}
          value={InputText}
        />
        <input type="submit" id="search.keyword.submit" value="search" />
      </fieldset>
    </form>
  );
};

const StyledInput = styled.input`
  /* width: 300px;
  height: 50px; */
  border-radius: 10px;
  padding-left: 15px;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
`;
export default SearchBar;
