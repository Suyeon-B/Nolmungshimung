import React from "react";

function CommonBtn(props) {
  return (
    <props.icon
      onClick={props.onClickEvent}
      style={props.style}
      twoToneColor={props?.twoToneColor}
    >
      {props.placeHolder}
    </props.icon>
  );
}

export default React.memo(CommonBtn);
