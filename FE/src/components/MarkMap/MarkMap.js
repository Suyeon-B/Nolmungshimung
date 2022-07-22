import React, { useEffect } from "react";

const { kakao } = window;

function MarkMap(props) {
  //루트 리스트 넘겨받기
  var imageSrc =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtNDMxLjc1IDM2NC40NGMxMC4yNTQgNS45NjQ4IDEwLjI1NCAxNy4xNTIgMCAyMi45MzRsLTExOS4xNCA2NC41MTJ2LTE1MS43N3ptLTU1Ljc1LTE2OC4zNmM0Ny45MTggMCA5My41OTggMTguNDU3IDEyNy4zNCA1Mi43NjYgMzIuMDcgMzIuNDQxIDUyLjU3OCA3Ny4xOTEgNTIuNTc4IDEyNy4xNiAwIDQ5LjQxLTIwLjUwOCA5NC4xNTYtNTIuNTc4IDEyNi43OS0zMi42MjkgMzMuMTg4LTc3LjkzOCA1My4xMzctMTI3LjM0IDUzLjEzNy00OS40MSAwLTk0LjcxNS0xOS45NDktMTI3LjM0LTUzLjEzNy0zMi42MjktMzIuNjI5LTUyLjU3OC03Ny4zNzUtNTIuNTc4LTEyNi43OSAwLTQ5Ljk2OSAxOS45NDktOTQuNzE1IDUyLjU3OC0xMjcuMTYgMzMuNzQ2LTM0LjMwOSA3OS40MjYtNTIuNzY2IDEyNy4zNC01Mi43NjZ6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==";
  let test = [
    { map_x: 33.452278, map_y: 126.567803 },
    { map_x: 33.452671, map_y: 126.574792 },
    { map_x: 33.451744, map_y: 126.572441 },
  ];
  function setBounds(map, bounds) {
    map.setBounds(bounds);
  }
  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  function makeOverListener(map, marker, infowindow) {
    return function () {
      infowindow.open(map, marker);
    };
  }

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  function makeOutListener(infowindow) {
    return function () {
      infowindow.close();
    };
  }

  let color = {
    FD6: "#975FFE",
    AT4: "#FF8A3D", // 관광, 명소
    CE7: "#FF6169", // 음식점>카페
    AD5: "#8DD664", // 숙박
    "": "#CFCFCF",
  };
  if (!props) {
    return <div>Loding...</div>;
  }
  const container = document.getElementById("myMap");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    draggable: false,
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);
  useEffect(() => {
    const linePath = props.map(function (place, idx) {
      //test를 props으로
      return {
        title: `<div key =${idx}>${place.place_name}</div>`,
        latlng: new kakao.maps.LatLng(place.y, place.x),
        category: place.category_group_code,
      };
    });
    const latlngs = linePath.map(function (place) {
      return place.latlng;
    });
    const polyline = new kakao.maps.Polyline({
      path: latlngs, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: "black", // 선의 색깔입니다
      strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다s
    });

    let bounds = new kakao.maps.LatLngBounds();

    for (let i = 0; i < linePath.length; i++) {
      var imageSize = new kakao.maps.Size(24, 35);
      var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      var content =
        `<div style="
          width: 27px;
          height: 27px;
          border-radius: 50%;
          background-color: ${color[linePath[i].category]};
          border: 2px solid white;
          display: flex;
          justify-content: center;
          align-items: center;
        "> ` +
        (i + 1) +
        "</div>";
      var marker = new kakao.maps.CustomOverlay({
        map: map,
        position: linePath[i].latlng,
        content: content,
        yAnchor: 1,
      });

      var marker = new kakao.maps.Marker({
        position: linePath[i].latlng,
        image: markerImage,
      });
      marker.setMap(map);
      bounds.extend(linePath[i].latlng);

      var infowindow = new kakao.maps.InfoWindow({
        content: linePath[i].title, // 인포윈도우에 표시할 내용
      });
      kakao.maps.event.addListener(
        marker,
        "mouseover",
        makeOverListener(map, marker, infowindow)
      );
      kakao.maps.event.addListener(
        marker,
        "mouseout",
        makeOutListener(infowindow)
      );
    }
    if (linePath.length > 0) {
      setBounds(map, bounds);
    }
    polyline.setMap(map); //
  }, [[...props]]);

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
