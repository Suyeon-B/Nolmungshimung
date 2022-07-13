import React, { useState } from "react";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SidePlanListDiv = styled.div`
  height: 100%;
`;
const StyledDragDropContext = styled(DragDropContext)``;

const testItem = [
  { id: "item-1", title: "제주 공항", category: "제주 공항" },
  { id: "item-2", title: "장소2", category: "음식점 · 제주 제주시" },
  { id: "item-3", title: "장소3", category: "음식점 · 제주 제주시" },
  { id: "item-4", title: "장소4", category: "관광명소 · 제주 제주시" },
  { id: "item-5", title: "장소5", category: "카페 · 제주 제주시" },
  { id: "item-6", title: "장소6", category: "관광명소 · 제주 제주시" },
  { id: "item-7", title: "장소7", category: "숙소" },
  { id: "item-11", title: "장소1", category: "관광명소 · 제주 제주시" },
  { id: "item-21", title: "장소2", category: "관광명소 · 제주 제주시" },
  { id: "item-31", title: "장소3", category: "관광명소 · 제주 제주시" },
  { id: "item-41", title: "장소4", category: "관광명소 · 제주 제주시" },
  { id: "item-51", title: "장소5", category: "음식점 · 제주 제주시" },
  { id: "item-61", title: "장소6", category: "카페 · 제주 제주시" },
  { id: "item-71", title: "장소7", category: "음식점 · 제주 제주시" },
];
// const testItem2 = [
//   { id: "item-11", title: "장소1" },
//   { id: "item-21", title: "장소2" },
//   { id: "item-31", title: "장소3" },
//   { id: "item-41", title: "장소4" },
//   { id: "item-51", title: "장소5" },
//   { id: "item-61", title: "장소6" },
//   { id: "item-71", title: "장소7" },
// ];

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

  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? "rgba(183, 183, 183, 0.45)" : "white",
  padding: "10px",
  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "rgba(183, 183, 183, 0.45)" : "white",
  // margin: "50px",
  // textAlign: "center",
  boxShadow: " inset 2px 4px 4px 2px rgba(0, 0, 0, 0.25)",
  borderRadius: "15px",
  padding: grid,
  height: "99%",
  width: 343,
  overflow: "scroll",
});

export default function SpotList({ dayItem, setItemRoute }) {
  // const [state, setState] = useState([testItem, testItem2]);

  const [state, setState] = useState([dayItem[0]]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(
        [dayItem[0]][sInd],
        source.index,
        destination.index
      );
      const newState = [...[dayItem[0]]];
      newState[sInd] = items;
      setItemRoute(newState);
    } else {
      const result = move(
        [dayItem[0]][sInd],
        [dayItem[0]][dInd],
        source,
        destination
      );
      const newState = [...[dayItem[0]]];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setItemRoute(newState.filter((group) => group.length));
    }
  }

  return (
    <SidePlanListDiv>
      <StyledDragDropContext onDragEnd={onDragEnd}>
        {[dayItem[0]].map((el, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDragging)}
                {...provided.droppableProps}
              >
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                          onMouseOver={() => {
                            <button>TEST</button>;
                          }}
                          onMouseOut={() => {}}
                        >
                          <SpotItemDiv>
                            <SpotTitle
                              className="spotTitle"
                              onClick={() => {
                                console.log("dd");
                              }}
                            >
                              {item.place_name}
                            </SpotTitle>
                            <SpotCategory>{item.category}</SpotCategory>
                          </SpotItemDiv>
                          <DeleteOutlined
                            style={{ fontSize: "25px" }}
                            onClick={() => {
                              const newState = [...[dayItem[0]]];
                              newState[ind].splice(index, 1);
                              setItemRoute(
                                newState.filter((group) => group.length)
                              );
                            }}
                          />
                        </div>
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
  );
}

const SpotItemDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 30px;
  width: 250px;
`;

const SpotTitle = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`;
const SpotCategory = styled.text`
  font-family: Rounded Mplus 1c Bold;
  font-style: normal;
  color: #adadad;
  font-weight: 700;
  font-size: 10px;
`;
