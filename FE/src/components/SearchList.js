import React, { useEffect, useState } from "react";
import dragFunction from "./DragAndDrop";

const SearchList = (Places) => {
    const places = Places
    return (
        <div>
        {places.map((item, i) => (
            <li
            onDragOver={(event) => {return dragFunction(event, 'over')}}
              onDrop={(event) => dragFunction(event, 'drop')}
              onDragEnter={(event) => dragFunction(event, 'enter')}
              onDragLeave={(event) => dragFunction(event, 'leave')}
              className='dragAndDrop'
              key={i}
              style={{
                border: "1px solid black",
                height: "auto",
                width: "100%",
                border: "1px solid black",
              }}
            >
              {/* <span>{i + 1}</span> */}
              <h5
              >{item.place_name}</h5>
              {item.road_address_name ? (
                <div style={{ margin: "10px 90px 0 0" }}>
                  <p title={item.road_address_name}>{item.road_address_name}</p>
                  {/* <p title = {item.address_name}>{item.address_name}</p> */}
                </div>
              ) : (
                <p>{item.address_name}</p>
              )}
              <p>{item.phone}</p>
            </li>
          ))}
        </div>
    )
}

export default SearchList;
