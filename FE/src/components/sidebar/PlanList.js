import React, { useState, useRef } from "react";
import styled from "styled-components";
import "../../App.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useContext } from "react";
import { ConnectuserContext } from "../../context/ConnectUserContext";

const StyledDragDropContext = styled(DragDropContext)``;

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

const getItemStyle = (isDragging, draggableStyle, color, userName) => ({
  // some basic styles to make the items look a bit nicer

  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "#EBEBEB" : "none",

  // border: userName === undefined ? null : `3px solid ${color}`,
  // border: `3px solid ${color}`,
  boxShadow: `inset 0px 0px 0px 3px ${color}`,
  boxSizing: "border-box",

  // transitionProperty: "backgroundColor ,none",
  // transitionDuration: "2s",
  // transition: "background ease 2s 0s",
  // background: ,
  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  // 드래그 영역으로 들어왔을 때
  background: isDraggingOver ? "lightblue" : "none",
  padding: grid,
  // width: 250,
  width: "100%",
  borderBottom: "3px solid #ebebeb",
});

const culTripTermData = (startDate, day) => {
  const sDate = new Date(startDate.slice(0, 3));
  sDate.setDate(sDate.getDate() + day);
  return `# ${sDate.getMonth() + 1}월 ${sDate.getDate()}일`;
};

function PlanList({
  toggleIsPage,
  goDetailPage,
  startDate,
  routes,
  setRoutes,
  setSelectedIndex,
  isFirstPage,
  setIsDrage,
  setIsAddDel,
  attentionIndex,
  setAttentionIndex,
}) {
  const droppableRef = useRef([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const { connectUser, setConnectUser } = useContext(ConnectuserContext);
  const userName = sessionStorage.getItem("myNickname");
  if (!routes) {
    return <div>Loading...</div>;
  }

  function onDragStart(result) {
    // console.log("drag start");
    // console.log("사용자 색 : ", connectUser[userName].color);
    // socket.emit("grabSpot", [projectId, userName, result.source.index]);
    // console.log(result.source.droppableId);
    // console.log(result.source.index);
    const newState = [...[...routes]];
    const { source, destination } = result;
    // console.log(newState);
    // console.log(newState[result.source.droppableId][result.source.index].lock);
    // if
    // console.log(source);
    // console.log(newState[source.droppableId][source.index]);
    const lockAcquire = newState[source.droppableId][source.index].userName;
    // console.log(lockAcquire);
    if (
      lockAcquire === null ||
      lockAcquire === userName ||
      lockAcquire === undefined
    ) {
      // console.log(newState[source.droppableId][source.index].lock);
      newState[source.droppableId][source.index].lock =
        connectUser[userName].color;
      newState[source.droppableId][source.index].user_name = userName;
    } else {
      alert("다른 친구가 옮기고 있습니다 ! 잠시 기다려 주세요!");
    }
    setRoutes(newState);
    // console.log(newState);
    setIsDrage(true);
    // console.log(newState[result]);
  }

  function onDragEnd(result) {
    // console.log(result);
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

      newState[sInd][result.destination.index].user_name = null;
      newState[sInd][result.destination.index].lock = "white";

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
      // console.log(newState[dInd][destination.index]);
      newState[dInd][destination.index].user_name = null;
      newState[dInd][destination.index].lock = "white"; // 수정예쩡
      // console.log(newState[dInd][destination.droppableId].user_name);
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
    // isFirstPage && toggleIsPage();
    isFirstPage && goDetailPage();
    if (selectIdx === attentionIndex) {
      setAttentionIndex(-1);
    }
  };

  return (
    <div>
      <SidePlanListDiv>
        <StyledDragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
                      attention={attentionIndex}
                    >
                      <DateDetailBtn data-idx={ind} onClick={onClick}>
                        {culTripTermData(startDate, ind)}

                        {Object.keys(connectUser).map((key) => {
                          // console.log(connectUser[key]);
                          if (key === userName) return;
                          if (connectUser[key].selectedIndex === ind) {
                            return (
                              <svg
                                data-idx={ind}
                                key={key}
                                width="10"
                                fill={connectUser[key].color}
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
                          <PlanItemDiv
                            userColor={item.lock}
                            // <StyleRouteDiv

                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              item.lock,
                              item.user_name
                            )}
                          >
                            <ItemInnerDiv>
                              {item.place_name.length > 11
                                ? item.place_name.slice(0, 12) + " ..."
                                : item.place_name}
                              <div
                                type="button"
                                onClick={() => {
                                  const newState = [...[...routes]];
                                  newState[ind].splice(index, 1);
                                  setRoutes(newState);
                                  setIsAddDel(true);
                                }}
                              >
                                {item.user_name && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      marginTop: "20px",
                                      backgroundColor: `${item.lock}`,
                                      color: "white",
                                      padding: "2px",
                                    }}
                                  >
                                    {item.user_name}
                                  </div>
                                )}
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
                          </PlanItemDiv>
                          // </StyleRouteDiv>
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

const StyleRouteDiv = styled.div`
  @keyframes color {
    0% {
      background: #2bb8ff;
    }
    20% {
      background: #59c7ff;
    }
    40% {
      background: #60caff;
    }
    60% {
      background: #89d7ff;
    }
    80% {
      background: #a3e0ff;
    }
    100% {
      background: none;
    }
  }
  border-radius: 5px;
  animation: color 2s linear;
`;

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

  background-color: ${(props) =>
    props.attention === props["data-idx"] && "yellow"};

  /* transition: all ease 2s 0s; */

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

const PlanItemDiv = styled.div`
  height: 38px;
  box-sizing: inherit;
  @keyframes color {
    0% {
      border: ${(props) => `3px solid ${props.userColor}`};
    }
    33% {
      border: ${(props) => `3px solid ${props.userColor - 33}`};
    }
    66% {
      border: ${(props) => `3px solid ${props.userColor}`};
    }
    100% {
      border: 3px solid white;
    }
  }

  animation: color 1.5s linear;
`;

export default PlanList;
