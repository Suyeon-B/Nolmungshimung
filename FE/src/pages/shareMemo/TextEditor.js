import React, { useEffect, useState, useRef, useContext } from "react";
import "./TextEditor.css";
import { Alert as MuiAlert } from "@material-ui/lab";
import OkdbClient from "okdb-client";
import cloneDeep from "lodash/cloneDeep";
import { isEmpty } from "lodash";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import TextEditorUsers from "./TextEditorUsers";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import socket from "../../socket";
import { ConnectuserContext } from "../../context/ConnectUserContext";

const EditorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  width: 100%;
`;
const EditorContainer = styled.div`
  width: 79%;
  background-color: #ffff;
  div#container {
    height: 35vh;
    width: 80vw;
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

  .ql-editor {
    min-height: 290px;
    max-height: 290px;
    width: 100%;
    height: calc(80% - 17px);
  }
`;

const OnlineFriends = styled.div`
  margin-left: 10px;
  min-width: 300px;
`;

Quill.register("modules/cursors", QuillCursors);

const HOST = `https://${process.env.REACT_APP_SERVER_IP}:7899`; // location of your server, use xxxxx to use sample, or follow this guide to build your own:
const myNickname = sessionStorage.getItem("myNickname");

const okdb = new OkdbClient(HOST, { timeout: 30000 });
window.okdb = okdb;
const DATA_TYPE = "todo-tasks"; // data type, typically corresponds to the table name

const TOOLBAR_OPTIONS = [
  [{ align: [] }],
  [{ header: [1, 2, 3, false] }],
  [{ font: [] }],
  ["bold", "underline", { color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "+1" }, { indent: "-1" }],
  ["link", "blockquote"],
];

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const colors = ["#FF8A3D", "#8DD664", "#FF6169", "#975FFE", "#0072BC"];

const getUserColor = (index) => colors[index % colors.length];

let newTs = new Set();

function TextEditor({ project_Id, selectedIndex, trip_Date }) {
  const [user, setUser] = useState(null);
  const [doc, setDoc] = useState(null);
  const [presences, setPresences] = useState({});
  const [error, setError] = useState(null);
  const connectedRef = useRef(false);
  const editorRef = useRef(null);
  const mousePointerRef = useRef(null);
  const editorCursorRef = useRef(null);
  const [projectID, setProjectId] = useState(project_Id);
  const { connectUser, setConnectUser } = useContext(ConnectuserContext);

  const userName = sessionStorage.getItem("myNickname");
  useEffect(() => {
    setProjectId(project_Id);
  }, [project_Id]);

  useEffect(() => {
    Object.keys(presences).map((presenceId) => {
      if (presenceId === userName) return;
      if (connectUser[presenceId] === undefined) {
        console.log(connectUser[presenceId]);
        setConnectUser(presences);
      }
      // setConnectUser(presences);
      else if (
        connectUser[presenceId].user.selectedIndex !==
        presences[presenceId].user.selectedIndex
      ) {
        console.log("============");
        console.log(
          presences[presenceId],
          presences[presenceId].user.selectedIndex
        );
        console.log(
          connectUser[presenceId],
          connectUser[presenceId].user.selectedIndex
        );
        setConnectUser(presences);
      }
    });
  }, [presences]);
  console.log(connectUser);

  useEffect(() => {
    return () => {
      console.log(selectedIndex, "  공유 편집 나가기");
      // selectedIndex로 공유 편집 나가기 구현하기
      socket.emit("exitSharedEditing", [projectID, selectedIndex, userName]);
      setPresences({});
    };
  }, []);

  useEffect(() => {
    console.log("날짜 변경");
    socket.emit("exitSharedEditing", [projectID, selectedIndex, userName]);
    setPresences({});
  }, [selectedIndex]);

  useEffect(() => {
    socket.on("deleteCurser", (name) => {
      console.log("deleteCurser", name);
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        delete newState[name];

        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          cursors.removeCursor(name);
        }

        return newState;
      });

      console.log(presences);
    });
  }, []);

  const presenceCallback = (tid, data) => {
    // callback to recieve status changes of other collaborators
    const id = data.user.name;

    if (id === userName) return;
    if (!data) {
      // if data is empty, then delete this presence, because the user is offline
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        delete newState[id];

        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          cursors.removeCursor(id);
        }
        return newState;
      });
    } else if (data.user && data.user.id) {
      // 온라인인 친구들의 커서를 띄웁니다.
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        // console.log(newState);
        newState[id] = {
          id,
          ...data,
        };

        const index = Object.keys(newState).findIndex((item) => item === id);
        const userColor = getUserColor(index);
        newState[id].color = userColor;
        // if (newState[id].color === undefined) {
        // }

        if (editorRef.current) {
          const cursors = editorRef.current.getModule("cursors");
          if (data.editorCursor) {
            cursors.createCursor(id, data.user.name, userColor);
            cursors.moveCursor(id, data.editorCursor);
            cursors.toggleFlag(id, true);
          } else {
            cursors.removeCursor(id);
          }
        }
        return newState;
      });
    }
  };

  useEffect(() => {
    // 1. step - connect
    if (myNickname) {
      okdb
        .connect({ myNickname, selectedIndex })
        .then((user) => {
          setUser({ name: myNickname }); // 세션에 저장된 이름으로 내 이름을 띄웁니다.
          // 2. step - open document for collaborative editing
          const defaultValue = [
            {
              insert: "",
            },
          ];

          const onOperation = (data, meta) => {
            // callback to receive changes from others

            if (!newTs.has(meta.ts)) {
              newTs.add(meta.ts);
              if (meta.user.name === userName) return;
              if (editorRef.current) {
                console.log("Editor update");
                editorRef.current.updateContents(data);
              }
            }
          };

          okdb
            .open(
              DATA_TYPE, // collection name
              // project_Id,
              // trip_Date,
              // tripDate,
              projectID,
              defaultValue, // default value to save if doesn't exist yet
              {
                type: "rich-text",
                onPresence: presenceCallback, // changes for online status and cursors
                onOp: onOperation, // process incremental delta changes directly, supported by Quill
              }
            )
            .then((data) => {
              // get data of opened doc
              connectedRef.current = true;
              setDoc(data);
            })
            .catch((err) => {
              console.log("Error opening doc ", err);
            });
        })
        .catch((err) => {
          console.error("[okdb] error connecting ", err);
          setError(err.message ? err.message : err);
        });
    }
  }, [selectedIndex]);

  useEffect(() => {
    console.log("Editor init");
    const editor = new Quill("#editor-container", {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: {
          transformOnTextChange: true,
        },
        history: {
          userOnly: true, // only user changes will be undone or redone.
        },
      },
      placeholder: "친구들과 메모를 적어보세요! :)",
    });

    editorRef.current = editor;

    editor.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      const contents = editor.getContents();

      // console.log("text-change ", delta, contents, source);
      delta.type = "rich-text";
      if (connectedRef.current) {
        // okdb.op(DATA_TYPE, project_Id, trip_Date, delta).catch((err) => console.log("Error updating doc", err));
        okdb
          .op(DATA_TYPE, projectID, delta)
          .catch((err) => console.log("Error updating doc", err));
      }
    });

    editor.on("selection-change", function (range, oldRange, source) {
      // console.log("Local cursor change: ", range);
      editorCursorRef.current = range;
      if (connectedRef.current) {
        okdb.sendPresence({
          editorCursor: range,
          mousePointer: mousePointerRef.current,
        });
      }
    });
  }, [editorRef]);

  useEffect(() => {
    const container = document.querySelector("#editor-container");

    const handler = (e) => {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      // calculate relative position of the mouse in the container
      var left = e.clientX - containerRect.left;
      var top = e.clientY - containerRect.top;
      const value = {
        left,
        top,
      };
      mousePointerRef.current = value;
      if (connectedRef.current) {
        okdb.sendPresence({
          mousePointer: value,
          editorCursor: editorCursorRef.current,
        });
      }
    };

    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
    };
  }, [editorRef]);

  useEffect(() => {
    if (doc && editorRef.current) {
      // console.log("Editor update", doc);
      editorRef.current.setContents(doc);
    }
  }, [editorRef, doc]);

  console.log(presences);
  return (
    <EditorBox>
      {error && <Alert severity="error">{error}</Alert>}
      <EditorContainer>
        <div id="editor-container"></div>
      </EditorContainer>
      <TextEditorUsers selectedIndex={selectedIndex} presences={presences} />
    </EditorBox>
  );
}

export default TextEditor;
