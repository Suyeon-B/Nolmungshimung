import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import styled from "styled-components";
import { io } from "socket.io-client";
// [수연][TextEditor] 추후 projectID 기준으로 변경 예정
import { useParams } from "react-router-dom";

const EditorContainer = styled.div`
  div#container {
    position: fixed;
    right: 0;
    bottom: 45px;
    width: 70%;
    height: 30%;
    padding: 1%;
  }
  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
  }
`;

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ indent: "+1" }, { indent: "-1" }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["link", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  // [수연][TextEditor] 추후 projectID 기준으로 변경 예정
  const { id: documentID } = useParams();

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // [수연][TextEditor] 추후 projectID 기준으로 변경 예정
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentID);
  }, [socket, quill, documentID]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    // [수연][TextEditor] Implement quill-cursors
    Quill.register("modules/cursors", QuillCursors);

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: true,
        history: {
          userOnly: true, // only user changes will be undone or redone.
        },
      },
      placeholder: "친구들과 메모를 적어보세요! :)",
    });
    q.disable();
    q.setText("메모를 가져오는 중...");
    setQuill(q);
  }, []);

  return (
    <EditorContainer>
      <div id="container" ref={wrapperRef}></div>
    </EditorContainer>
  );
}
