import React from "react";
import EditablePage from "./editablePage";

function MainEditablePage() {
  return (
    <>
      <p className="Intro">
        {" "}
        친구들과 메모를 적어보세요!
        <span role="img" aria-label="smiley" className="Emoji">
          🤗
        </span>{" "}
        <span className="Code">/</span> 키로 빠르게 작성도 가능해요.
      </p>
      <EditablePage />
    </>
  );
}

export default MainEditablePage;
