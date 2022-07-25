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

const MemoRtc = ({ project_Id }) => {
  // const auth = useAuth();
  let quillRef = null;
  let reactQuillRef = null;
  Quill.register("modules/cursors", QuillCursors);
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
    try {
      provider.awareness.setLocalStateField("user", {
        name: userName,
        color: connectUser[userName].color,
      });
    } catch (err) {
      alert("로그인을 해주세요.");
      window.location.href = "/";
    }

    // console.log(" ==== socket 접속자 수 : ", socket._callbacks.$deleteCurser.length);
    // const connectUsers = socket._callbacks.$deleteCurser.length;

    const connectUsers = Object.keys(connectUser).length;
    // console.log(" @#@#@#@#@# connectuser : ", connectUsers);
    if (connectUsers < 2) {
      fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/memo/${projectID}`,
        {
          method: "get",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log("===== fetch 결과 =====");
          // console.log(res[0].insert);
          const len = quillRef.editor.delta.ops.length;
          for (var i = 0; i < len; i++) {
            ytext.insert(i, res[i].insert.slice(0, -1));
          }
        });
    }

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);

    return () => {
      socket.emit("save_memo", [projectID, quillRef.editor.delta.ops]);
      provider.destroy();
    };
  }, []);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

  const modulesRef = {
    toolbar: TOOLBAR_OPTIONS,
    cursors: {
      transformOnTextChange: true,
      toggleFlag: true,
    },
    history: {
      // Local undo shouldn't undo changes
      // from remote users
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
  /* background-color: red; */

  width: 58vw;
`;

const EditorContainer = styled.div`
  /* background-color: blue; */
  width: 100%;
  height: 100%;
  .quill {
    height: 84%;
  }
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
    /* height: 195px; */
  }
  .ql-editor strong {
    font-weight: bold;
  }
`;

export default React.memo(MemoRtc);
