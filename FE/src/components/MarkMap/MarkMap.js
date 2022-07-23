import React, { useEffect, useState } from "react";

const { kakao } = window;
var map;
var bounds;
var polyline;
var markers = [];
function MarkMap(item, selectedIndex) {
  const [position, setPosition] = useState([]);
  const [line, setLine] = useState([]);
  //루트 리스트 넘겨받기

  let test = [
    { map_x: 33.452278, map_y: 126.567803 },
    { map_x: 33.452671, map_y: 126.574792 },
    { map_x: 33.451744, map_y: 126.572441 },
  ];
  function setBounds(map, bounds) {
    map.setBounds(bounds);
  }

  let color = {
    FD6: "#975FFE",
    AT4: "#FF8A3D", // 관광, 명소
    CE7: "#FF6169", // 음식점>카페
    AD5: "#8DD664", // 숙박
    "": "#CFCFCF",
  };
  if (!item[selectedIndex]) {
    return <div>Loding...</div>;
  }

  useEffect(() => {
    var mapContainer = document.getElementById("myMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        draggable: false,
        level: 3, // 지도의 확대 레벨
      };
    console.log("렌더링ㄴ");
    map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    polyline = new kakao.maps.Polyline({
      // path: line, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 2.4, // 선의 두께 입니다
      strokeColor: "#123444", // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "dash", // 선의 스타일입니다s
    });
    map.setMaxLevel(10);
  }, [item[selectedIndex]]);

  useEffect(() => {
    // console.log(props);

    for (var j = 0; j < markers.length; j++) {
      markers[j].setMap(null);
    }
    // setMarker([]);
    markers = [];
    let linePath = item[selectedIndex].map(function (place, idx) {
      //test를 props으로
      return {
        // title: `<div key =${idx}>${place.place_name}</div>`,
        latlng: new kakao.maps.LatLng(place.y, place.x),
        category: place.category_group_code,
      };
    });

    let latlngs = linePath.map(function (place) {
      return place.latlng;
    });

    setPosition(linePath);
    setLine(latlngs);
    // console.log("props : ", props);
  }, [item, selectedIndex]);

  useEffect(() => {
    // for (let i = 0; i < markers.length; i++) {
    //   console.log(markers);
    //   markers[i].setMap(null);
    // }
    bounds = new kakao.maps.LatLngBounds();
    console.log("안녕");

    console.log(position);
    for (var i = 0; i < position.length; i++) {
      var content =
        `<div style="
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background-color: ${color[position[i].category]};
          border: 2px solid white;
          display: flex;
          justify-content: center;
          align-items: center;
        "> ` +
        (i + 1) +
        "</div>";
      var marker = new kakao.maps.CustomOverlay({
        map: map,
        position: position[i].latlng,
        content: content,
        yAnchor: 1,
      });

      markers.push(marker);

      // marker = new kakao.maps.Marker({
      //   map: map,
      //   // position: linePath[i].latlng,
      //   // image: markerImage,
      // });

      // marker.setPosition(position[i].latlng);
      bounds.extend(position[i].latlng);

      // markers.push(marker);
    }
    if (position.length > 0) {
      setBounds(map, bounds);
    }
    polyline.setPath(line);
    polyline.setMap(map);
  }, [position]);

  // return (
  // <div
  //   id="myMap"
  //   style={{
  //     width: "500px",
  //     height: "500px",
  //   }}
  // ></div>
  // );
}

export default MarkMap;
