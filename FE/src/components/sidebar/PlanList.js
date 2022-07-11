import React, { useState } from "react";
import styled from "styled-components";

const PlanItemStyled = styled.li`
  width: 100%;
  height: 30px;
  background-color: white;
  border: 1px solid;
`;

const SidePlanListUl = styled.ul`
  height: 70%;
  background-color: blueviolet;
`;

const testItem = [
  { id: 1, title: "장소1" },
  { id: 2, title: "장소2" },
  { id: 3, title: "장소3" },
  { id: 4, title: "장소4" },
  { id: 5, title: "장소5" },
  { id: 6, title: "장소6" },
  { id: 7, title: "장소7" },
];

const PlanList = () => {
  const [lists, setLists] = useState(testItem);
  const [grab, setGrab] = React.useState(null);

  const _onDragOver = (e) => {
    e.preventDefault();
  };

  const _onDragStart = (e) => {
    setGrab(e.target);
    e.target.classList.add("grabbing");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const _onDragEnd = (e) => {
    e.target.classList.remove("grabbing");

    e.dataTransfer.dropEffect = "move";
  };

  const _onDrop = (e) => {
    let grabPosition = Number(grab.dataset.position);
    let targetPosition = Number(e.target.dataset.position);

    let _list = [...lists];
    _list[grabPosition] = _list.splice(
      targetPosition,
      1,
      _list[grabPosition]
    )[0];

    setLists(_list);
    console.log(lists);
  };

  return (
    <SidePlanListUl>
      {lists.map((el, index) => (
        <PlanItemStyled
          key={index}
          data-position={index}
          onDragOver={_onDragOver}
          onDragStart={_onDragStart}
          onDragEnd={_onDragEnd}
          onDrop={_onDrop}
          draggable
        >
          {el.title}
        </PlanItemStyled>
      ))}
      {}
    </SidePlanListUl>
  );
};

export default PlanList;
