import React, { useCallback } from "react";
import Quill from "quill";

const ShowMemoResult = ({ project_info }) => {
  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;

      try {
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor);
        q.disable();
        q.setText("메모를 가져오는 중...");
        // console.log(project_info);
        q.setContents(project_info.quillRefEditor);
      } catch (err) {
        console.log("메모 가져오기 실패 ㅠㅠ");
      }
    },
    [project_info]
  );

  if (project_info) {
    return <div id="container" ref={wrapperRef}></div>;
  }
};

export default React.memo(ShowMemoResult);
