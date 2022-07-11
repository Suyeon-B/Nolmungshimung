import Search from "antd/lib/transfer/search";
import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import searchList from "./SearchList";

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
    
    const searchOption = {
      // location: currentPos,
      radius: 1000,
      size: 15,
      page: 10
    };

    ps.keywordSearch(
      searchPlace ? '제주도' + searchPlace : '제주도',
      placesSearchCB,
      searchOption
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
    <div style={{ positon: "relative"}}>
      <div
        id="myMap"
        style={{
          width: "71.5vw",
          height: "100vh",
          position: "relative",
          float: "right",
        }}
      ></div>
      <ul
        id="result-list"
        style={{
          position: "relative",
          zIndex: 2,
          overflow: "scroll",
          width: "20vw",
          height: "95vh",
          float: "left",
          marginTop: 26,
        }}
      >
        {Places? searchList(Places): null}
        <div id="pagination" style={{ position: "relative", zIndex: 2 }}></div>
      </ul>
    </div>
  );
};

export default React.memo(MapContainer);
