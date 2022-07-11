import React from "react";
import styled from "styled-components";
import SpotList from "../../components/spot/SpotList";
import MarkMap from "../../components/MarkMap/MarkMap";
import TextEditor from "../shareMemo/TextEditor";

function SpotRoute() {
  return (
    <div>
      <section>
        {/* 지도 api 연결안하면 에러떠서 주석처리함 */}
        {/* <MarkMap /> */}
        <SpotList />
      </section>
      {/* <TextEditor /> */}
      {/* hyeok socket io 연결안하면 에러떠서 주석처리함 */}
    </div>
  );
}

export default SpotRoute;
