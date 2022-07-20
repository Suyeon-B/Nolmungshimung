import React, { useEffect, useState, useRef, useContext } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import ReactQuill from "react-quill";
import styled from "styled-components";
import { ConnectuserContext } from "../../context/ConnectUserContext";

const EditorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // height: 47%;
`;

const EditorContainer = styled.div`
  // div#container {
  //   height: 35vh;
  //   width: 61vw;
  //   padding: 1%;
  // }
  height: 35vh;
  width: 61vw;
  padding: 1%;
  height: 47%;
  .ql-editor {
    height: 200px;
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

const MemoTestRtc = ({ project_Id }) => {
  // const editorRef = useRef();
  let quillRef = null;
  let reactQuillRef = null;
  Quill.register("modules/cursors", QuillCursors);
  // const [aware, setAwareness] = useState(null);
  const [projectID, setProjectId] = useState(project_Id);
  const { connectUser, setConnectUser } = useContext(ConnectuserContext);

  const userName = sessionStorage.getItem("myNickname");
  useEffect(() => {
    setProjectId(project_Id);
  }, [project_Id]);

  useEffect(() => {
    attachQuillRefs();

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(`${projectID}`, ydoc);
    const ytext = ydoc.getText(`${projectID}`);
    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: connectUser[userName].color,
    });

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
    // return () => {
    //   WebrtcProvider.destroy();
    // };
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
