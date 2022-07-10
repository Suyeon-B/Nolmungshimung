import { resolveOnChange } from "rc-input/lib/utils/commonUtils";
import React, { useEffect, useState } from "react";
import dragFunction from "./DragAndDrop";

const SearchList = (Places) => {
    const [rtn, setRTN] = useState([]);

    function getData(){ return rtn }

    function GetGooglePlaceId(input){
        let url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
        const api_key = 'AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E';
        url = url + 'input=' + input +'&inputtype=textquery' + '&key=' + api_key

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.candidates[0] && data.candidates[0].place_id){
                    // console.log(data.candidates[0].place_id)
                    let url = "https://maps.googleapis.com/maps/api/place/details/json?fields=name,rating,formatted_phone_number,photo,type,opening_hours,price_level,review,user_ratings_total&place_id=";
                    fetch(url + data.candidates[0].place_id + '&key=' + api_key)
                        .then((res) => res.json())
                        .then((data) => {
                            console.log('-----', data)
                            setRTN(data.result.opening_hours.weekday_text)
                            return 0;
                        })
                        .catch((error) => {
                            console.log("error:", error);
                            return 0;
                        });
                }
                return 0;
            })
            .catch((error) => {
                console.log("error:", error)
                return 0;
            });
            return 0;
    }

    function makeLI(item, i){
        return (
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
              <p>{item.category_group_name}</p>
              <p>{item.phone}</p>
              <a target="_blank" href={item.place_url}>카카오맵에서 상세보기</a>
                {/* {item.road_address_name ? GetGooglePlaceId(item.road_address_name + '' + item.place_name): null} */}
                {/* <p>{getData()}</p> */}
              <div></div>
            </li>
        )
    }

    return (
        <div>
        {Places.map((item, i) => (
            makeLI(item, i)
            // <li
            // onDragOver={(event) => {return dragFunction(event, 'over')}}
            //   onDrop={(event) => dragFunction(event, 'drop')}
            //   onDragEnter={(event) => dragFunction(event, 'enter')}
            //   onDragLeave={(event) => dragFunction(event, 'leave')}
            //   className='dragAndDrop'
            //   key={i}
            //   style={{
            //     border: "1px solid black",
            //     height: "auto",
            //     width: "100%",
            //     border: "1px solid black",
            //   }}
            // >
            //   {/* <span>{i + 1}</span> */}
            //   <h5
            //   >{item.place_name}</h5>
            //   {item.road_address_name ? (
            //     <div style={{ margin: "10px 90px 0 0" }}>
            //       <p title={item.road_address_name}>{item.road_address_name}</p>
            //       {/* <p title = {item.address_name}>{item.address_name}</p> */}
            //     </div>
            //   ) : (
            //     <p>{item.address_name}</p>
            //   )}
            //   <p>{item.category_group_name}</p>
            //   <p>{item.phone}</p>
            //   <a target="_blank" href={item.place_url}>카카오맵에서 상세보기</a>
            //     {item.road_address_name ? GetGooglePlaceId(item.road_address_name + '' + item.place_name): null}
            //     <p>{getData()}</p>
            //   <div></div>
            // </li>
          ))}
        </div>
    )
}

export default SearchList;
