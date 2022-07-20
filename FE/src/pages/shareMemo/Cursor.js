import React, { useEffect, useState } from "react";
import "./TextEditor.css";
import cloneDeep from "lodash/cloneDeep";
import "quill/dist/quill.snow.css";
import TextEditorUsers from "./TextEditorUsers";
import styled from "styled-components";
import socket from "../../socket";

const EditorBox = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  width: 100%; */
`;

function Cursor({ project_Id, selectedIndex }) {
  const [presences, setPresences] = useState({});
  const userName = sessionStorage.getItem("myNickname");

  let cursor;
  // 마우스 mousemove에 대한 이벤트 처리
  // 움직일때 socket 이벤트를 발생하여 다른 유저에게 나의 위치를 전달한다.
  const mouseFunc = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    const userInfo = {};
    userInfo[userName] = {
      mousePointer: { top: y, left: x },
      selectedIndex: selectedIndex,
    };
    socket.emit("mouse_move", [project_Id, userInfo, selectedIndex, userName]);
  };

  // 날짜를 변경하였을때 다른 유저에게 날짜가 변경되었을을 알리는 소켓을 발생한다.
  useEffect(() => {
    socket.emit("detail_date_join", [project_Id, selectedIndex]);

    cursor = document.querySelector("#cursor_item");
    window.addEventListener("mousemove", mouseFunc);
    return () => {
      socket.emit("detail_date_leave", [project_Id, userName, selectedIndex]);

      window.removeEventListener("mousemove", mouseFunc);
    };
  }, [selectedIndex]);

  // 공유페이지를 나가면 다른 유저에게 보이는 마우스 커를 지우는 이벤트를 일으킨다.
  useEffect(() => {
    socket.on("deleteCurser", (name) => {
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        delete newState[name];

        return newState;
      });
    });
    return () => {
      console.log(selectedIndex, "  공유 편집 나가기");
      // selectedIndex로 공유 편집 나가기 구현하기
      socket.emit("exitSharedEditing", [project_Id, selectedIndex, userName]);
      setPresences({});
      window.removeEventListener("mousemove", mouseFunc);
    };
  }, []);

  // 다른 유저의 마우스 커서 정보를 받아 온다.
  useEffect(() => {
    socket.on("mouse_update", (mouseInfo) => {
      setPresences((prev) => {
        const newState = { ...prev, ...mouseInfo };
        return newState;
      });
    });
  }, []);

  return (
    <EditorBox>
      <div id="editor-container"></div>
      <div id="cursor_item"></div>
      <TextEditorUsers presences={presences} selectedIndex={selectedIndex} />
    </EditorBox>
  );
}

export default Cursor;