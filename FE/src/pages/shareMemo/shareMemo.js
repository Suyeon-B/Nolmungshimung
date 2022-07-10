import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import styled from "styled-components";

// modules
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditContainer = styled.div`
  position: fixed;
  width: 60%;
  max-height: 40%;
  bottom: 50px;
  right: 50px;
`;

const Editor = () => {
  return (
    <EditContainer>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Hello from CKEditor 5!</p>"
        config={{
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "imageUpload",
              "blockQuote",
              "insertTable",
              "undo",
              "redo",
            ],
          },
          language: "ko",
          image: {
            toolbar: ["imageTextAlternative", "imageStyle:inline", "imageStyle:block", "imageStyle:side"],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        onReady={(editor) => {
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
        }}
        onBlur={(event, editor) => {
          console.log("Blur.", editor);
        }}
        onFocus={(event, editor) => {
          console.log("Focus.", editor);
        }}
      />
    </EditContainer>
  );
};

export default Editor;
