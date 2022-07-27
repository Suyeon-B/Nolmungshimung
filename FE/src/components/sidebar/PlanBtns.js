import React from "react";
import styled from "styled-components";
import SearchBtn from "../../atomics/SearchBtn";
import DetailBtn from "../../atomics/DetailBtn";
function PlanBtns({ onClickSearch, searchColor, detailColor, onClickDetail }) {
  return (
    <SideBarBtnDIv>
      <SearchBtn
        onClickSearch={onClickSearch}
        searchColor={searchColor}
        placeHolder="검색"
      />
      <DetailBtn
        detailColor={detailColor}
        onClickDetail={onClickDetail}
        placeHolder="상세"
      />
    </SideBarBtnDIv>
  );
}

const SideBarBtnDIv = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-top: 2px solid #ebebeb;
  border-bottom: 2px solid #ebebeb;
  cursor: pointer;
`;

export default React.memo(PlanBtns);
