import React, { useState, useRef } from "react";
import styled from "styled-components";
import "../../App.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect } from "react";

const StyledDragDropContext = styled(DragDropContext)``;

const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer

  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "#EBEBEB" : "none",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  // 드래그 영역으로 들어왔을 때
  background: isDraggingOver ? "lightblue" : "none",
  padding: grid,
  // width: 250,
  width: "100%",
});

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate.slice(0, 3));
  sDate.setDate(sDate.getDate() + day);
  return `# ${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

function PlanList({
  toggleIsPage,
  startDate,
  term,
  routes,
  setRoutes,
  setSelectedIndex,
  isFirstPage,
  setIsDrage,
  setIsAddDel,
}) {
  const droppableRef = useRef([]);
  const [selectedDay, setSelectedDay] = useState(0);
  // console.log(routes);
  if (!routes) {
    return <div>Loading...</div>;
  }

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder([...routes][sInd], source.index, destination.index);
      const newState = [...[...routes]];
      newState[sInd] = items;
      console.log(newState);
      setRoutes(newState);
    } else {
      const result = move([...routes][sInd], [...routes][dInd], source, destination);
      const newState = [...[...routes]];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      console.log(newState);
      setRoutes(newState);
    }
    // console.log(`selectIdx: ${selectIdx}`);

    setIsDrage(true);
  }

  // useEffect(() => {
  //   setSelectedDay(0);
  // }, [routes]);

  const onClick = (event) => {
    const selectIdx = +event.target.dataset.idx;
    setSelectedIndex(selectIdx);
    setSelectedDay(selectIdx);
    isFirstPage && toggleIsPage();
  };

  return (
    <div>
      <SidePlanListDiv>
        <StyledDragDropContext onDragEnd={onDragEnd}>
          {[...routes].map((el, ind) => (
            <div key={ind} ref={(el) => (droppableRef.current[+ind] = el)}>
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDragging)} {...provided.droppableProps}>
                    <DateDetailBtnDiv data-idx={ind} onClick={onClick} selected={selectedDay}>
                      <DateDetailBtn data-idx={ind} onClick={onClick}>
                        {culTripTermData(startDate, ind)}
                      </DateDetailBtn>
                      <DateDetailBtn data-idx={ind} onClick={onClick}>
                        <img
                          data-idx={ind}
                          onClick={onClick}
                          style={{ width: "15px" }}
                          src="\statics\images\date_arrow.png"
                        />
                      </DateDetailBtn>
                    </DateDetailBtnDiv>
                    {el.map((item, index) => (
                      <Draggable key={item.uid} draggableId={item.uid} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <ItemInnerDiv>
                              {item.place_name}
                              <div
                                type="button"
                                onClick={() => {
                                  const newState = [...[...routes]];
                                  newState[ind].splice(index, 1);
                                  setRoutes(newState);
                                  setIsAddDel(true);
                                }}
                              >
                                <img class="planListTrashCan" src="\statics\images\trash_can.png" />
                              </div>
                            </ItemInnerDiv>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </StyledDragDropContext>
      </SidePlanListDiv>
    </div>
  );
}

const SidePlanListDiv = styled.div`
  height: 75vh;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const DateDetailBtnDiv = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;

  background-color: ${(props) => props.selected === props["data-idx"] && "#DEDEDE"};

  &:hover {
    background-color: #dedede;
  }
`;

const DateDetailBtn = styled.button`
  outline: 0;
  border: none;
  font-weight: 700;
  font-size: 20px;
  border: none;
  outline: 0;

  margin-right: 10px;
  margin-left: 10px;

  color: #757575;
  background-color: rgba(255, 255, 255, 0);
  /* &:hover {
    background-color: red;
  } */
`;

const ItemInnerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-left: 25px;
  // margin-right: 10px;
  // margin-left: 10px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  align-items: center;

  &:hover {
    background-color: #ebebeb;
  }
`;

export default PlanList;
