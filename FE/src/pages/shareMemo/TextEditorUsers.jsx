import React from "react";
import MousePointer from "./MousePointer";

const TextEditorUsers = ({ presences, selectedIndex }) => {
  console.log(presences);
  return (
    <>
      {Object.keys(presences).map((presenceId) => {
        const presence = presences[presenceId];
        const userColor = presence.color;
        const userSelectedIndex = presence.user.selectedIndex;
        // if (selectedIndex !== userSelectedIndex) {
        //   console.log(selectedIndex);
        //   console.log(userSelectedIndex);
        //   console.log(presences)

        //   console.log("여기 걸리냐?");
        //   return;
        // }
        let left = 0;
        let top = 0;
        if (presence.mousePointer && presence.mousePointer.left != null) {
          const container = document.querySelector("#editor-container");
          if (container) {
            const containerRect = container.getBoundingClientRect();
            top = containerRect.top + presence.mousePointer.top + "px";
            left = containerRect.left + presence.mousePointer.left + "px";
          }
        }

        return (
          <div className="online-item" key={presenceId}>
            <svg
              width="10"
              fill={userColor}
              focusable="false"
              viewBox="0 0 10 10"
              aria-hidden="true"
              title="fontSize small"
            >
              <circle cx="5" cy="5" r="5"></circle>
            </svg>
            {presence.user.name}
            {presence.mousePointer && presence.mousePointer.left != null && (
              <div id="cursor" className="cursor-block" style={{ left, top }}>
                <MousePointer color={userColor} />
                <div className="cursor-name-container">
                  <div
                    className="cursor-name"
                    style={{ backgroundColor: userColor }}
                  >
                    {presence.user.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default TextEditorUsers;
