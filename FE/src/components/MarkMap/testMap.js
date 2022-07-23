import { useEffect, useState } from "react";
const { kakao } = window;

import React from "react";
let i = 0;
var map;
var bounds;
var markers = [];

function TestMap(props) {
  // const [markers, setMarker] = useState([]);
  const [position, setPosition] = useState([
    {
      title: "카카오",
      latlng: new kakao.maps.LatLng(33.450705, 126.570677),
    },
  ]);
  var positions = [
    [
      {
        title: "카카오",
        latlng: new kakao.maps.LatLng(33.705, 126.677),
      },
      {
        title: "생태연못",
        latlng: new kakao.maps.LatLng(33.450936, 126.569477),
      },
    ],
    [
      {
        title: "텃밭",
        latlng: new kakao.maps.LatLng(33.450879, 126.56994),
      },
      {
        title: "근린공원",
        latlng: new kakao.maps.LatLng(33.451393, 126.570738),
      },
    ],
  ];

  const onClick = (e) => {
    i = i + 1;
    if (i > 1) {
      i = 0;
    }
    for (var j = 0; j < markers.length; j++) {
      markers[j].setMap(null);
    }
    // setMarker([]);
    markers = [];
    console.log(markers);

    console.log(i);
    setPosition(positions[i]);
  };
  useEffect(() => {
    var mapContainer = document.getElementById("myMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };
    console.log("렌더링ㄴ");
    map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    bounds = new kakao.maps.LatLngBounds();
  }, []);
  useEffect(() => {
    // 마커를 표시할 위치와 title 객체 배열입니다ㄴㄴㅌ

    // 마커 이미지의 이미지 주소입니다
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    console.log(position);
    for (var k = 0; k < position.length; k++) {
      let marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position[k].latlng, // 마커를 표시할 위치
      });
      console.log(marker);
      // setMarker([...markers,  marker]);
      markers.push(marker);
      console.log("추가", markers.length);
      bounds.extend(position[k].latlng);
      map.setBounds(bounds);
    }
    // kakao.maps.event.addListener(marker, "click", function () {
    //   marker.setMap(null);
    // });
    // marker.setMap(map); // 지도에 올린다.
  }, [position]);
  // setTimeout(2000);
  // marker.setMap(null); // 지도에서 제거한다.

  return (
    <div>
      <div
        id="myMap"
        style={{
          width: "500px",
          height: "500px",
        }}
      ></div>
      <button onClick={onClick}>click</button>
    </div>
  );
}

export default TestMap;
