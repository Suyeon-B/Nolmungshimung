import React, { useEffect, useState } from "react";

function DragAndDrop(e, t) {
    const dragFunction = (event, type) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(type)
    }
    dragFunction(e, t)
}

export default DragAndDrop;