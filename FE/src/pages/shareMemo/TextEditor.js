import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import styled from "styled-components";
import { io } from "socket.io-client";
// [수연][TextEditor] 추후 projectID 기준으로 변경 예정
import { useParams } from "react-router-dom";

const EditorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 47%;
`;

const EditorContainer = styled.div`
  div#container {
    height: 35vh;
    width: 61vw;
    padding: 1%;
  }
  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
  }
  .ql-editor strong {
    font-weight: bold;
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

export default function TextEditor({ project_Id }) {
  // [수연][TextEditor] 추후 projectID 기준으로 변경 예정
  // const { projectId: projectID } = useParams();

  const [projectID, setProjectId] = useState(project_Id);

  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    setProjectId(project_Id);
  }, [project_Id]);
  console.log(projectID);
  useEffect(() => {
    // const s = io(`http://${process.env.REACT_APP_SERVER_IP}:3001`);
    const s = io(`http://localhost:3001`);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // [수연][TextEditor] 추후 projectID 기준으로 변경 예정
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-project", (project) => {
      console.log(project);
      quill.setContents(project);
      quill.enable();
    });

    socket.emit("get-project", projectID);
  }, [socket, quill, projectID]);

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
      socket.emit("save-project", quill.getContents());
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
    <EditorBox>
      <EditorContainer>
        <div id="container" ref={wrapperRef}></div>
      </EditorContainer>
    </EditorBox>
  );
}
