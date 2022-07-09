import Search from "antd/lib/transfer/search";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import dragFunction from "./DragAndDrop";

const { kakao } = window;

const MapContainer = ({ searchPlace }) => {
  // 검색결과 배열에 담아줌

  const [Places, setPlaces] = useState([]);

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    var markers = [];
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      searchPlace ? "제주도 " + searchPlace : "제주도 ",
      placesSearchCB
    );

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        map.setBounds(bounds);
        // 페이지 목록 보여주는 displayPagination() 추가
        displayPagination(pagination);
        setPlaces(data);
      }
    }

    // 검색결과 목록 하단에 페이지 번호 표시
    function displayPagination(pagination) {
      var paginationEl = document.getElementById("pagination"),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지 번호 삭제
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement("a");
        el.href = "#";
        el.innerHTML = " " + i;

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    // function displaySearchList(places) {
    //   const searchList = document.getElementById("result-list");
    //   while (searchList.hasChildNodes()) {
    //     searchList.removeChild(searchList.lastChild);
    //   }
    //   places.map((item, i) => {
    //     searchList.appendChild(searchPlaceList(item, i)
    //   })

    // }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
  }, [searchPlace]);


  return (
    <div style={{ positon: "absolute" }}>
      <div
        id="myMap"
        style={{
          width: "70%",
          height: "500px",
          position: "relative",
          float: "right",
        }}
      ></div>
      <ul
        id="result-list"
        style={{
          position: "absolute",
          zIndex: 2,
          overflow: "scroll",
          width: "30%",
          height: "500px",
          float: "left",
          margin: 0,
          padding: 0,
          paddingTop: 26,
        }}
      >
        {Places.map((item, i) => (
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
        <div id="pagination" style={{ position: "absolute", zIndex: 2 }}></div>
      </ul>
    </div>
  );
};

export default MapContainer;
