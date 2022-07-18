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

const DATA = {
  a: {
    color: "#FF8A3D",
    id: "a",
    user: { id: 1, name: "a", selectedIndex: 0 },
  },
  b: {
    color: "#8DD664",
    id: "b",
    user: { id: 2, name: "b", selectedIndex: 1 },
  },
  c: {
    color: "#FF6169",
    id: "c",
    user: { id: 3, name: "c", selectedIndex: 2 },
  },
  d: {
    color: "#975FFE",
    id: "d",
    user: { id: 4, name: "d", selectedIndex: 1 },
  },
  e: {
    color: "#0072BC",
    id: "e",
    user: { id: 5, name: "e", selectedIndex: 0 },
  },
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
  console.log(day);
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
      const result = move(
        [...routes][sInd],
        [...routes][dInd],
        source,
        destination
      );
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
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDragging)}
                    {...provided.droppableProps}
                  >
                    <DateDetailBtnDiv
                      data-idx={ind}
                      onClick={onClick}
                      selected={selectedDay}
                    >
                      <DateDetailBtn data-idx={ind} onClick={onClick}>
                        {culTripTermData(startDate, ind)}
                        {Object.keys(DATA).map((el) => {
                          if (DATA[el].user.selectedIndex === ind) {
                            return (
                              <svg
                                data-idx={ind}
                                key={el}
                                width="10"
                                fill={DATA[el].color}
                                focusable="false"
                                viewBox="0 0 10 10"
                                aria-hidden="true"
                                title="fontSize small"
                              >
                                <circle
                                  data-idx={ind}
                                  cx="5"
                                  cy="5"
                                  r="5"
                                ></circle>
                              </svg>
                            );
                          }
                        })}
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
                      <Draggable
                        key={item.uid}
                        draggableId={item.uid}
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
                                  const newState = [...[...routes]];
                                  newState[ind].splice(index, 1);
                                  setRoutes(newState);
                                  setIsAddDel(true);
                                }}
                              >
                                <svg
                                  className="planListTrashCan"
                                  fill="#7C8289"
                                  width="12"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                >
                                  <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" />
                                </svg>
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

  background-color: ${(props) =>
    props.selected === props["data-idx"] && "#ebebeb"};

  &:hover {
    background-color: #ebebeb;
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

  color: #7c8289;
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

  border-radius: 5px;

  &:hover {
    background-color: #ebebeb;
  }

  .planListTrashCan {
    margin-right: 17px;
  }
`;

export default PlanList;
