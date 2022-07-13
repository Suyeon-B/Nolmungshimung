import React, { useEffect, useState, useRef } from "react";
import "./TextEditor.css";
import { Container, Paper, Grid } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
import OkdbClient from "okdb-client";
import cloneDeep from "lodash/cloneDeep";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import TextEditorUsers from "./TextEditorUsers";

Quill.register("modules/cursors", QuillCursors);

const HOST = `http://${process.env.REACT_APP_SERVER_IP}:7899`; // location of your server, use xxxxx to use sample, or follow this guide to build your own:
const TOKEN = "12345"; // either get it from your auth provider and validate with system integration, or use default system users:
const okdb = new OkdbClient(HOST, { timeout: 30000 });
window.okdb = okdb;
const DATA_TYPE = "todo-tasks"; // data type, typically corresponds to the table name
const DOCUMENT_ID = "design-doc0"; // id of the object to be edited collaboratively

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const colors = ["#5551FF", "#0FA958"];

const getUserColor = (index) => colors[index % colors.length];

function TextEditor() {
  const [user, setUser] = useState(null);
  const [doc, setDoc] = useState(null);
  const [presences, setPresences] = useState({});
  const [error, setError] = useState(null);
  const connectedRef = useRef(false);
  const editorRef = useRef(null);
  const mousePointerRef = useRef(null);
  const editorCursorRef = useRef(null);

  const presenceCallback = (id, data) => {
    // callback to recieve status changes of other collaborators
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
      setPresences((prev) => {
        const newState = cloneDeep(prev);
        newState[id] = {
          id,
          ...data,
        };
        const index = Object.keys(newState).findIndex((item) => item === id);
        const userColor = getUserColor(index);
        newState[id].color = userColor;
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
    console.log(okdb);
    okdb
      .connect(TOKEN)
      .then((user) => {
        setUser(user);
        // 2. step - open document for collaborative editing
        const defaultValue = [
          {
            insert: "Hello world\n",
          },
        ];
        const onOperation = (data, meta) => {
          // callback to receive changes from others
          console.log("onOperation", data, meta);
          if (editorRef.current) {
            console.log("Editor update", data);
            editorRef.current.updateContents(data);
          }
        };

        okdb
          .open(
            DATA_TYPE, // collection name
            DOCUMENT_ID,
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
  }, []);

  useEffect(() => {
    console.log("Editor init");
    const editor = new Quill("#editor-container", {
      theme: "snow",
      modules: {
        cursors: {
          transformOnTextChange: true,
        },
      },
    });

    editorRef.current = editor;

    editor.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      const contents = editor.getContents();

      console.log("text-change ", delta, contents, source);
      delta.type = "rich-text";
      if (connectedRef.current) {
        okdb.op(DATA_TYPE, DOCUMENT_ID, delta).catch((err) => console.log("Error updating doc", err));
      }
    });
    editor.on("selection-change", function (range, oldRange, source) {
      console.log("Local cursor change: ", range);
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
      console.log("Editor update", doc);
      editorRef.current.setContents(doc);
    }
  }, [editorRef, doc]);

  return (
    <Container maxWidth="md" className="container">
      <Grid container spacing={3}>
        <Grid item md={9}>
          {error && <Alert severity="error">{error}</Alert>}
          <Paper>
            <div id="editor-container"></div>
          </Paper>
        </Grid>
        <Grid item md={3}>
          <div className="online-panel">
            <h4>Online:</h4>
            <div className="online-item" key="000">
              <svg width="10" focusable="false" viewBox="0 0 10 10" aria-hidden="true" title="fontSize small">
                <circle cx="5" cy="5" r="5"></circle>
              </svg>
              me ({user ? user.name : "connecting..."})
            </div>
            <TextEditorUsers presences={presences} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TextEditor;
