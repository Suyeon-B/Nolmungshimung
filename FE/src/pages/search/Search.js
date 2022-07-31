import React, { useEffect, useState, useCallback } from "react";
import SearchListRoute from "../../components/searchMap/SearchListRoute";
import SearchBar from "../../components/searchMap/SearchBar";
import styled from "styled-components";
// import NomalMarker from "../../../public/statics/images/location-dot-solid.svg";
import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import MapSearchBtn from "../../atomics/MapSearchBtn";
import Badge from "../../atomics/Badge";

const { kakao } = window;

var MARKER_WIDTH = 73, // 기본, 클릭 마커의 너비
  MARKER_HEIGHT = 76, // 기본, 클릭 마커의 높이
  OVER_MARKER_WIDTH = 90, // 오버 마커의 너비
  OVER_MARKER_HEIGHT = 92, // 오버 마커의 높이
  NOMAL_MARKER_URL =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtMzk2LjUxIDU2Ny41N2MtMTguNjQ4IDExLjMxMi00Mi45NDkgNS4zNzg5LTU0LjI3My0xMy4yNS02OS41OTQtMTE0LjQ4LTEwNC4zNi0xOTIuMzktMTA0LjM2LTIzNy42NiAwLTc2LjIwMyA2MS44NC0xMzcuOTggMTM4LjEyLTEzNy45OCA3Ni4yODkgMCAxMzguMTMgNjEuNzc3IDEzOC4xMyAxMzcuOTggMCA0NS4yNzctMzQuNzY2IDEyMy4xOS0xMDQuMzYgMjM3LjY2LTMuMjkzIDUuNDE0MS03LjgzOTggOS45NjA5LTEzLjI2MiAxMy4yNXptLTIwLjM1OS0xOTEuNTdjMzIuNzMgMCA1OS4yNjItMjYuNTA0IDU5LjI2Mi01OS4xOTUgMC0zMi42OTUtMjYuNTMxLTU5LjE5OS01OS4yNjItNTkuMTk5LTMyLjczIDAtNTkuMjYyIDI2LjUwNC01OS4yNjIgNTkuMTk5IDAgMzIuNjkxIDI2LjUzMSA1OS4xOTUgNTkuMjYyIDU5LjE5NXoiIGZpbGw9IiMwMDQ0OWUiLz4KPC9zdmc+Cg==",
  CLICK_MARKER_URL =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtMzk2LjUxIDU2Ny41N2MtMTguNjQ4IDExLjMxMi00Mi45NDkgNS4zNzg5LTU0LjI3My0xMy4yNS02OS41OTQtMTE0LjQ4LTEwNC4zNi0xOTIuMzktMTA0LjM2LTIzNy42NiAwLTc2LjIwMyA2MS44NC0xMzcuOTggMTM4LjEyLTEzNy45OCA3Ni4yODkgMCAxMzguMTMgNjEuNzc3IDEzOC4xMyAxMzcuOTggMCA0NS4yNzctMzQuNzY2IDEyMy4xOS0xMDQuMzYgMjM3LjY2LTMuMjkzIDUuNDE0MS03LjgzOTggOS45NjA5LTEzLjI2MiAxMy4yNXptLTIwLjM1OS0xOTEuNTdjMzIuNzMgMCA1OS4yNjItMjYuNTA0IDU5LjI2Mi01OS4xOTUgMC0zMi42OTUtMjYuNTMxLTU5LjE5OS01OS4yNjItNTkuMTk5LTMyLjczIDAtNTkuMjYyIDI2LjUwNC01OS4yNjIgNTkuMTk5IDAgMzIuNjkxIDI2LjUzMSA1OS4xOTUgNTkuMjYyIDU5LjE5NXoiIGZpbGw9IiNhNjExMjIiLz4KPC9zdmc+Cg==";

var markerSize = new kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
  overMarkerSize = new kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT); // 오버 마커의 크기

var normalImage = createMarkerImage(markerSize, NOMAL_MARKER_URL),
  overImage = createMarkerImage(overMarkerSize, NOMAL_MARKER_URL),
  clickImage = createMarkerImage(markerSize, CLICK_MARKER_URL);

var map;
var ps;
var markers = [];
var selectedMarker = null;
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;">' + title + "</div>";
  infowindow.setContent(content);
  infowindow.open(map, marker);
}
export function overEvent(index) {
  if (!selectedMarker || selectedMarker !== markers[index][0]) {
    displayInfowindow(markers[index][0], markers[index][1]);
    markers[index][0].setImage(overImage);
  }
}
export function outEvent(index) {
  if (!selectedMarker || selectedMarker !== markers[index][0]) {
    markers[index][0].setImage(normalImage);
    infowindow.close();
  }
}
export function clickEvent(index) {
  if (!selectedMarker || selectedMarker !== markers[index][0]) {
    !!selectedMarker && selectedMarker.setImage(normalImage);
    markers[index][0].setImage(clickImage);
  }
  selectedMarker = markers[index][0];
}
function createMarkerImage(markerSize, markerUrl) {
  var markerImage = new kakao.maps.MarkerImage(
    markerUrl, // 스프라이트 마커 이미지 URL
    markerSize // 마커의 크기
  );

  return markerImage;
}

const Search = ({
  itemRoutes,
  setItemRoutes,
  projectId,
  startDate,
  setIsAddDel,
}) => {
  const [searchPlace, setSearchPlace] = useState("");
  // 검색결과 배열에 담아줌
  const [Places, setPlaces] = useState([]);
  const [click, setClick] = useState(null);
  const [swLatlng, setSwLatlng] = useState([
    33.592161526546604, 126.04650255976554,
  ]);
  const [neLatlng, setNeLatlng] = useState([
    33.14572269165777, 127.07480227781775,
  ]);
  const [sumit, setSumit] = useState(false);
  const [placeRender, setPlaceRender] = useState(null);

  const onClick = useCallback(() => {
    console.log("on click");
    var bounds = map.getBounds();
    var swLatlng = bounds.getSouthWest();
    var neLatlng = bounds.getNorthEast();

    setSwLatlng([swLatlng["Ma"], swLatlng["La"]]);
    setNeLatlng([neLatlng["Ma"], neLatlng["La"]]);
    // console.log(swLatlng, neLatlng);

    setSumit(!sumit);
  }, [swLatlng, neLatlng, sumit]);

  const handleSelect = useCallback((value) => {
    setClick(value);
  }, []);

  function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
      markers[i][0].setMap(null);
    }
    markers = [];
  }

  function displayMarker(place, i) {
    let marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
      image: normalImage,
    });
    // itemEl = getListItem(i, place); // 검색 결과 항목 Element를 생성합니다
    markers.push([marker, place.place_name]);
    kakao.maps.event.addListener(marker, "mouseover", function () {
      overEvent(i);
      // console.log(place);
    });

    kakao.maps.event.addListener(marker, "mouseout", function () {
      outEvent(i);
    });
    kakao.maps.event.addListener(marker, "click", function () {
      clickEvent(i);
      setClick(i);

      let sec = document.querySelector(`#list${i}`);
      let positionEle = sec.getBoundingClientRect().top;
      if (positionEle <= 0 || positionEle >= window.innerHeight - 100) {
        document.getElementById("searchBar").scrollTop = sec.offsetTop - 200;
      }

      // place.id 보내서 크롤링하기
    });
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
            setClick(null);
            document.getElementById("searchBar").scrollTop = 0;
          };
        })(i);
      }
      fragment.appendChild(el);
    }

    paginationEl.appendChild(fragment);
  }

  useEffect(() => {
    const container = document.getElementById("searchMap");
    const options = {
      center: new kakao.maps.LatLng(33.50723387768472, 126.49273150835002),
      level: 6,
    };
    map = new kakao.maps.Map(container, options);
    map.setMaxLevel(10);

    ps = new kakao.maps.services.Places();

    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);
    map.setMaxLevel(10);
  }, []);

  useEffect(() => {
    var sw = new kakao.maps.LatLng(swLatlng[0], swLatlng[1]),
      ne = new kakao.maps.LatLng(neLatlng[0], neLatlng[1]);
    const searchOption = {
      bounds: new kakao.maps.LatLngBounds(sw, ne),
      size: 15,
    };

    ps.keywordSearch(
      searchPlace ? searchPlace : "제주도",
      placesSearchCB,
      searchOption
    );

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      // console.log(swLatlng, neLatlng);
      setPlaces([]);
      if (status === kakao.maps.services.Status.OK) {
        //정상 검색되면
        removeMarker();
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i], i); //데이터 마커 표시
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
        displayPagination(pagination); //데이터 목록 표시
        setPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        removeMarker();
        displayPagination(pagination);
        Badge.fail("검색 실패", "검색 결과가 존재하지 않습니다.");

        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        removeMarker();
        displayPagination(pagination);
        Badge.fail("검색 실패", "검색 결과 중 오류가 발생했습니다.");

        return;
      }
    }

    kakao.maps.event.addListener(map, "bounds_changed", function () {
      //
    });
  }, [sumit]);

  useEffect(() => {
    if (Places.length === 0) {
      setPlaceRender(null);
      return;
    }
    setPlaceRender(
      Places.map((item, i) => (
        <SearchListRoute
          id={"list" + i}
          key={i}
          itemRoutes={itemRoutes}
          setItemRoutes={setItemRoutes}
          projectId={projectId}
          route={item}
          idx={i}
          startDate={startDate}
          setIsAddDel={setIsAddDel}
          selected={click === i ? true : false}
          handleSelect={handleSelect}
        />
      ))
    );
  }, [Places, click]);

  return (
    <Wapper>
      <SearchListDiv>
        <SearchBar
          changePlace={setSearchPlace}
          handleSelect={handleSelect}
          sumit={setSumit}
          current={sumit}
          setSwLatlng={setSwLatlng}
          setNeLatlng={setNeLatlng}
        />
        <SearchUl id="searchBar">
          {placeRender}
          {/* {Places &&
            Places.map((item, i) => (
              <SearchListRoute
                id={"list" + i}
                key={i}
                itemRoutes={itemRoutes}
                setItemRoutes={setItemRoutes}
                projectId={projectId}
                route={item}
                idx={i}
                startDate={startDate}
                setIsAddDel={setIsAddDel}
                selected={click === i ? true : false}
                handleSelect={handleSelect}
              />
            ))} */}
          <div
            id="pagination"
            style={{ position: "relative", zIndex: 2 }}
          ></div>
        </SearchUl>
      </SearchListDiv>
      <StyledMapDiv id="searchMap">
        <MapSearchBtn onClick={onClick} />
        {/* <Button
          onClick={onClick}
          type="primary"
          shape="round"
          icon={<RedoOutlined />}
          size={"large"}
          style={{
            backgroundColor: "#ff8a3d",
            borderColor: "#ff8a3d",
            zIndex: 2,
            position: "fixed",
            bottom: "70px",
            left: "1070px",
          }}
        >
          현지도에서 검색
        </Button> */}
      </StyledMapDiv>
    </Wapper>
  );
};

const Wapper = styled.div`
  display: flex;
`;

const SearchListDiv = styled.div`
  padding-top: 27.5px;
  width: 340px;
  height: 100vh;
`;

const SearchUl = styled.ul`
  height: 93%;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }

  scroll-behavior: smooth;
`;

const StyledMapDiv = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100vh;
  min-width: calc(100% - 340px);
  position: relative;
`;

export default React.memo(Search);
