import React, { useEffect } from "react";

const { kakao } = window;

function MarkMap(props) {
  //루트 리스트 넘겨받기
  let imageSrc =
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  let test = [
    { map_x: 33.452278, map_y: 126.567803 },
    { map_x: 33.452671, map_y: 126.574792 },
    { map_x: 33.451744, map_y: 126.572441 },
  ];
  const linePath = props.map(function (place) {
    //test를 props으로
    return new kakao.maps.LatLng(place.map_x, place.map_y);
  });
  const polyline = new kakao.maps.Polyline({
    path: linePath, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 5, // 선의 두께 입니다
    strokeColor: "#FFAE00", // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: "solid", // 선의 스타일입니다s
  });
  function setBounds(map, bounds) {
    map.setBounds(bounds);
  }
  useEffect(() => {
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      draggable: false,
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    let bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < linePath.length; i++) {
      var content =
        `<div style="
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background-color: yellow;
          border: 2px solid white;
          display: flex;
          justify-content: center;
          align-items: center;
        "> ` +
        (i + 1) +
        "</div>";
      new kakao.maps.CustomOverlay({
        map: map,
        position: linePath[i],
        content: content,
        yAnchor: 1,
      });
      bounds.extend(linePath[i]);
    }
    if (linePath.length > 0) {
      setBounds(map, bounds);
    }
    polyline.setMap(map);
  }, []);

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
