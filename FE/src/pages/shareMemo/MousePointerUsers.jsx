import React from "react";
import MousePointer from "./MousePointer";

const MousePointerUsers = ({ presences, selectedIndex }) => {
  // console.log(presences);
  return (
    <>
      {Object.keys(presences).map((presenceId) => {
        const presence = presences[presenceId];
        const userColor = presence.color;
        if (presence.selectedIndex !== selectedIndex) {
          return;
        }

        let left = 0;
        let top = 0;
        if (presence.mousePointer && presence.mousePointer.left != null) {
          const container = document.querySelector("#editor-container");
          if (container) {
            const containerRect = container.getBoundingClientRect();
            // top = containerRect.top + presence.mousePointer.top + "px";
            top = presence.mousePointer.top + "px";
            // left = containerRect.left + presence.mousePointer.left + "px";
            left = presence.mousePointer.left + "px";
          }
        }

        return (
          <div className="online-item" key={presenceId}>
            {presence.mousePointer && presence.mousePointer.left != null && (
              <div
                id="cursor"
                className="cursor-block"
                style={{ left, top, zIndex: 999 }}
              >
                <MousePointer color={userColor} />
                <div className="cursor-name-container">
                  <div
                    className="cursor-name"
                    style={{ backgroundColor: userColor }}
                  >
                    {presenceId}
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

export default MousePointerUsers;
