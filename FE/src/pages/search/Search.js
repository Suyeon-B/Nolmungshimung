import React, { useState } from "react";
import MapContainer from "../../components/searchMap/MapContainer";

function Form(props) {
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
      className="inputForm"
      onSubmit={handleSubmit}
      style={{ position: "absolute", zIndex: 3 }}
    >
      <fieldset class="fld_inside">
        <div class="box_searchbar">
          <input
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
        </div>
      </fieldset>
    </form>
  );
}

function Search() {
  const [Place, setPlace] = useState("");

  return (
    <div style={{ position: "relative" }}>
      <Form changePlace={setPlace} />
      <div id="info">
        <MapContainer searchPlace={Place} />
      </div>
    </div>
  );
}

export default Search;
