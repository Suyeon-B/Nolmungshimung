import React, { useState, useRef } from "react";
import styled from "styled-components";

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

  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "#EBEBEB" : "none",
  // paddingLeft: "25px",
  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  // 드래그 영역으로 들어왔을 때
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  // width: 250,
  width: "100%",
});

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate.slice(0, 3));
  sDate.setDate(sDate.getDate() + day);
  return `# ${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

function PlanList({ startDate, term, routes }) {
  const [state, setState] = useState([...routes]);
  const tripTermDate = [];

  useEffect(() => {
    setState([...routes]);
  }, [routes]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }
  // const btnRef = useRef();

  // const onMouseEnter = (e) => {
  //   // console.log(e.target);
  //   console.log(btnRef.current);
  // };
  // const onMouseLeave = (e) => {};

  return (
    <div>
      <SidePlanListDiv>
        <StyledDragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDragging)}
                  {...provided.droppableProps}
                >
                  <DateDetailBtnDiv>
                    <DateDetailBtn>
                      {culTripTermData(startDate, ind)}
                    </DateDetailBtn>
                    <NoneStyleBtn>
                      <img
                        style={{ width: "15px" }}
                        src="\statics\images\date_arrow.png"
                      />
                    </NoneStyleBtn>
                  </DateDetailBtnDiv>
                  {el.map((item, index) => (
                    <Draggable
                      key={item.travel_id}
                      draggableId={item.travel_id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <ItemInnerDiv>
                            {item.place_name}

                            <div
                              type="button"
                              onClick={() => {
                                const newState = [...state];
                                newState[ind].splice(index, 1);
                                setState(
                                  newState.filter((group) => group.length)
                                );
                              }}
                            >
                              <img
                                style={{ width: "16px" }}
                                src="\statics\images\trash_can.png"
                              />
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
const NoneStyleBtn = styled.button`
  outline: 0;
  border: none;
  background-color: white;
`;
const DateDetailBtnDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const DateDetailBtn = styled(NoneStyleBtn)`
  font-weight: 700;
  font-size: 20px;
  border: none;
  outline: 0;

  color: #757575;
  background-color: white;
`;

const ItemInnerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-left: 25px;

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
