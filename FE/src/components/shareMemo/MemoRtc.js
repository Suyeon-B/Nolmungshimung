import React, { useEffect, useState, useContext } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import ReactQuill from "react-quill";
import styled from "styled-components";
import { ConnectuserContext } from "../../context/ConnectUserContext";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Auth";

const TOOLBAR_OPTIONS = [
  [{ align: [] }],
  [{ header: [1, 2, 3, false] }],
  [{ font: [] }],
  ["bold", "underline", { color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "+1" }, { indent: "-1" }],
  ["link", "blockquote"],
];

const MemoRtc = ({ project_Id, userName }) => {
  let quillRef = null;
  let reactQuillRef = null;
  Quill.register("modules/cursors", QuillCursors);
  const [projectID, setProjectId] = useState(project_Id);
  const { connectUser, setConnectUser } = useContext(ConnectuserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setProjectId(project_Id);
  }, [project_Id]);

  useEffect(() => {
    attachQuillRefs();

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(`${projectID}`, ydoc);
    const ytext = ydoc.getText(`${projectID}`);

    try {
      provider.awareness.setLocalStateField("user", {
        name: userName,
        color: connectUser[userName].color,
      });
      // console.log(userName);
      // console.log(connectUser[userName].color);
      // console.log(provider.awareness);
    } catch (err) {
      alert("로그인을 해주세요.");
      navigate("/");
    }

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
    const connectUsers = Object.keys(connectUser).length;

    if (connectUsers < 2) {
      fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/projects/memo/${projectID}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res != "\n") {
            quillRef.setContents(res);
          } else {
            quillRef.setContents("");
          }
        });
    }

    return () => {
      socket.emit("save_memo", [projectID, quillRef.getContents()]);
      provider.destroy();
    };
  }, [connectUser]);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

  const modulesRef = {
    toolbar: TOOLBAR_OPTIONS,
    cursors: {
      transformOnTextChange: true,
      hide: false,
      selectionChangeSource: null,
      transformOnTextChange: true,
    },
    history: {
      userOnly: true,
    },
  };

  return (
    <StyledEditorBox>
      <EditorContainer>
        <ReactQuill
          ref={(el) => {
            reactQuillRef = el;
          }}
          modules={modulesRef}
          theme={"snow"}
          placeholder={"친구들과 메모를 작성해보세요. :)"}
        />
      </EditorContainer>
    </StyledEditorBox>
  );
};

const StyledEditorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 47%;
  width: 100%;
  font-size: medium;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  .quill {
    height: 84%;
  }
  .ql-editor {
    font-size: medium;
  }
  div#container {
    height: 35vh;
    width: 61vw;
    padding: 1%;
  }
  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
    display: flex;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
    max-height: 35vh;
  }
  .ql-editor strong {
    font-weight: bold;
  }
  .q1-cursor {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .ql-cursor-flag {
    visibility: visible !important;
    opacity: 1 !important;
  }
  .ql-snow .ql-formats {
    display: flex;
    vertical-align: middle;
  }
`;

export default React.memo(MemoRtc);
