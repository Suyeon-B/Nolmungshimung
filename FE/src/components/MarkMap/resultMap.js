import React, { useEffect } from "react";

const { kakao } = window;

function ResultMap(props) {
  const color = {
    FD6: "#975FFE",
    AT4: "#FF8A3D", // 관광, 명소
    CE7: "#FF6169", // 음식점>카페
    AD5: "#8DD664", // 숙박
    "": "#CFCFCF",
  };
  function setBounds(map, bounds) {
    map.setBounds(bounds);
  }
  useEffect(() => {
    // console.log(props.routes);
    let bounds = new kakao.maps.LatLngBounds();
    const routes = [];
    const lines = [];

    if (props.routes === null) {
      return;
    }
    for (var i = 0; i < props.routes.length; i++) {
      const linePath = props.routes[i].map(function (place, idx) {
        return {
          latlng: new kakao.maps.LatLng(place.y, place.x),
          category: place.category_group_code,
        };
      });
      const latlngs = linePath.map(function (place) {
        return place.latlng;
      });
      routes.push(linePath);
      lines.push(latlngs);
    }

    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 4, // 지도의 확대 레벨
      };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    map.setMaxLevel(10);

    // console.log(routes);
    for (var i = 0; i < routes.length; i++) {
      for (var j = 0; j < routes[i].length; j++) {
        var content =
          `<div style="
        width: 27px;
        height: 27px;
        border-radius: 50%;
        background-color: ${color[routes[i][j].category]};
        border: 2px solid ${props.colorArr[i]};
        display: flex;
        justify-content: center;
        align-items: center;
      "> ` +
          (j + 1) +
          "</div>";

        var marker = new kakao.maps.CustomOverlay({
          map: map,
          position: routes[i][j].latlng,
          content: content,
          yAnchor: 1,
        });
        marker.setMap(map);
        bounds.extend(routes[i][j].latlng);
        setBounds(map, bounds);
      }
      const polyline = new kakao.maps.Polyline({
        path: lines[i], // 선을 구성하는 좌표배열 입니다
        strokeWeight: 3.4, // 선의 두께 입니다
        strokeColor: `${props.colorArr[i]}`, // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "dash", // 선의 스타일입니다s
        // strokeStyle: "dashed",
      });
      polyline.setMap(map); //
    }
  });
  return (
    <div
      id="map"
      style={{
        width: "80vw",
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat ",
        left: 0,
        top: 0,
      }}
    ></div>
  );
}

export default React.memo(ResultMap);
