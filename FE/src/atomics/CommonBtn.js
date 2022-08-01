import React, { useState } from "react";

function CommonBtn(props) {
  const [isHover, setIsHover] = useState(false);
  return (
    <props.icon
      onClick={props.onClickEvent}
      style={{
        fontSize: isHover ? `${props.fontSize}px` : `${props.fontSize - 3}px`,
      }}
      twoToneColor={props?.twoToneColor}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      {props.placeHolder}
    </props.icon>
  );
}

export default React.memo(CommonBtn);
