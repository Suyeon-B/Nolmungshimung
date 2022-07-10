import React, { useState } from "react";
import styled from "styled-components";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const SidePlanListDiv = styled.div`
  height: 75vh;
  overflow: scroll;
`;
const StyledDragDropContext = styled(DragDropContext)``;

const testItem = [
  { id: "item-1", title: "장소1" },
  { id: "item-2", title: "장소2" },
  { id: "item-3", title: "장소3" },
  { id: "item-4", title: "장소4" },
  { id: "item-5", title: "장소5" },
  { id: "item-6", title: "장소6" },
  { id: "item-7", title: "장소7" },
];
const testItem2 = [
  { id: "item-11", title: "장소1" },
  { id: "item-21", title: "장소2" },
  { id: "item-31", title: "장소3" },
  { id: "item-41", title: "장소4" },
  { id: "item-51", title: "장소5" },
  { id: "item-61", title: "장소6" },
  { id: "item-71", title: "장소7" },
];

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
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  // width: 250,
  width: "100%",
});

function QuoteApp() {
  const [state, setState] = useState([testItem, testItem2]);

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
                  7월 {ind + 1}일
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
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
                              justifyContent: "space-around",
                            }}
                          >
                            {item.title}
                            <button
                              type="button"
                              onClick={() => {
                                const newState = [...state];
                                newState[ind].splice(index, 1);
                                setState(
                                  newState.filter((group) => group.length)
                                );
                              }}
                            >
                              delete
                            </button>
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
    </div>
  );
}

export default QuoteApp;
