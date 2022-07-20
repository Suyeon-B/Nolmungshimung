import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

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
const TOOLBAR_OPTIONS = [
  [{ align: [] }],
  [{ header: [1, 2, 3, false] }],
  [{ font: [] }],
  ["bold", "underline", { color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "+1" }, { indent: "-1" }],
  ["link", "blockquote"],
];
export const usercolors = [
  { color: "#ff8a3d" }, // 주황색
  { color: "#339f46" }, // 초록색
  { color: "#2b96ad" }, // 파란색
  { color: "#975FFE" }, // 보라색
  { color: "#232a3c" }, // 남색
  { color: "#FF6169" }, // 핑크색
];

const MemoTestRtc = () => {
  const editorRef = useRef();
  let quillRef = null;
  let reactQuillRef = null;
  Quill.register("modules/cursors", QuillCursors);
  // const [aware, setAwareness] = useState(null);
  useEffect(() => {
    attachQuillRefs();

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider("share-memo", ydoc);
    const ytext = ydoc.getText("quill");
    provider.awareness.setLocalStateField("user", {
      name: "suyeon",
      color: "#FF6169",
    });

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
  }, []);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

  const modulesRef = {
    toolbar: TOOLBAR_OPTIONS,
    cursors: true,
    history: {
      // Local undo shouldn't undo changes
      // from remote users
      userOnly: true,
    },
  };

  return (
    <EditorBox>
      <EditorContainer>
        <ReactQuill
          ref={(el) => {
            reactQuillRef = el;
          }}
          modules={modulesRef}
          theme={"snow"}
        />
      </EditorContainer>
    </EditorBox>
  );
};

export default MemoTestRtc;
