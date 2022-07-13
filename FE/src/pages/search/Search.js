import React, { useEffect, useState } from "react";
// import searchList from "./SearchList";
import SearchList from "../../components/searchMap/SearchList";
import SearchBar from "../../components/searchMap/SearchBar";
import styled from "styled-components";

const { kakao } = window;

const Search = ({ projectId }) => {
  const [searchPlace, setSearchPlace] = useState("");
  // 검색결과 배열에 담아줌
  var markers = [];
  const [Places, setPlaces] = useState([]);

  const searchOption = {
    // location: currentPos,
    radius: 1000,
    size: 15,
    page: 10,
  };

  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    function displayInfowindow(marker, title) {
      var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

      infowindow.setContent(content);
      infowindow.open(map, marker);
    }

    const container = document.getElementById("searchMap");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 6,
    };
    const map = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(
      searchPlace ? "제주도" + searchPlace : "제주도",
      placesSearchCB,
      searchOption
    );

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      setPlaces([]);
      if (status === kakao.maps.services.Status.OK) {
        //정상 검색되면
        removeMarker();
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]); //데이터 마커 표시
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
        displayPagination(pagination); //데이터 목록 표시
        setPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        displayPagination(pagination);
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        displayPagination(pagination);
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
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
      markers.push(marker);
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, place.place_name);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });
    }
  }, [searchPlace]);

  return (
    <Wapper>
      <SearchListDiv>
        <SearchBar changePlace={setSearchPlace} />
        <ul>
          {Places && <SearchList Places={Places} projectId={projectId} />}
          <div
            id="pagination"
            style={{ position: "relative", zIndex: 2 }}
          ></div>
        </ul>
      </SearchListDiv>
      <StyledMapDiv id="searchMap"></StyledMapDiv>
    </Wapper>
  );
};

const Wapper = styled.div`
  display: flex;
`;

const SearchListDiv = styled.div`
  width: 30%;
  height: 100vh;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  /* background-color: red; */
`;

const StyledMapDiv = styled.div`
  width: 70%;
  height: 100vh;
  position: relative;
`;

const StyledUl = styled.ul``;

export default React.memo(Search);
