import { useEffect, useState } from "react";
const { kakao } = window;

import React from "react";
let i = 0;
function TestMap(props) {
  const [position, setPosition] = useState({
    title: "카카오",
    latlng: new kakao.maps.LatLng(33.450705, 126.570677),
  });
  var positions = [
    {
      title: "카카오",
      latlng: new kakao.maps.LatLng(33.705, 126.677),
    },
    {
      title: "생태연못",
      latlng: new kakao.maps.LatLng(33.450936, 126.569477),
    },
    {
      title: "텃밭",
      latlng: new kakao.maps.LatLng(33.450879, 126.56994),
    },
    {
      title: "근린공원",
      latlng: new kakao.maps.LatLng(33.451393, 126.570738),
    },
  ];
  const onClick = (e) => {
    i = i + 1;
    if (i > 3) {
      i = 0;
    }
    setPosition(positions[i]);
    console.log(i);
  };
  var mapContainer = document.getElementById("myMap"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
  var bounds = new kakao.maps.LatLngBounds();
  useEffect(() => {
    // 마커를 표시할 위치와 title 객체 배열입니다

    // 마커 이미지의 이미지 주소입니다
    var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (var i = 0; i < positions.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position.latlng, // 마커를 표시할 위치
        // title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        // image: markerImage, // 마커 이미지
      });

      // marker.setPosition(position.latlng);
      bounds.extend(position.latlng);
      map.setBounds(bounds);
    }
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
