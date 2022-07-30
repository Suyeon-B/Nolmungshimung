import { useRef, useEffect, useState } from "react";
import ScrollHorizontal from "react-scroll-horizontal";
import styled from "styled-components";
import ScrollRow from "./ScrollRow";

function Observer({ onIntersect, stopObserver }) {
  // console.log(stopObserver);
  if (stopObserver == true) return;
  const ref = useRef(null);

  useEffect(() => {
    let node = ref.current;
    if (node !== null) {
      let options = {
        root: null,
        routeMargin: "200px",
        threshold: 0.2,
      };

      let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      }, options);

      observer.observe(node);

      return () => {
        observer.unobserve(node);
        observer.disconnect();
      };
    }
  }, [onIntersect]);

  return (
    <div
      ref={ref}
      id="observer-target"
      style={{
        right: "0px",
        width: "200px",
        height: "200px",
        // borderRadius: "10px",
        // background: "#565656",
        // position: "absolute",
      }}
    ></div>
  );
}

// ScrollView
function ScrollView() {
  const [uploadProjectInfo, setUploadProjectInfo] = useState([]);
  const [skip, setSkip] = useState(0);
  const [stopObserver, setStopObserver] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  // infinite scroll
  const fetchUploadProjectInfo = async () => {
    try {
      const request = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/infinite?skip=${skip}`);
      const uploadProjectInfoJson = await request.json();
      setUploadProjectInfo([...uploadProjectInfo, ...uploadProjectInfoJson]);
      setSkip(skip + 8);
      // console.log("인피니트 스크롤 결과");
      // console.log(uploadProjectInfoJson);
      if (uploadProjectInfoJson.length === 0) {
        if (isFirst) {
          setIsFirst(false);
        } else {
          setStopObserver(true);
        }
      }
    } catch (e) {
      console.log("말도안돼 T_T");
    }
  };

  // This function is passed as a "callback prop" to the "Observer" component
  const loadMore = () => {
    fetchUploadProjectInfo();
  };

  return (
    <RecommendContents>
      <ScrollHorizontal transition="0.2">
        <ScrollViewContents>
          {uploadProjectInfo.map((el, i) => {
            return <ScrollRow el={el} key={i} />;
          })}
          <Observer onIntersect={loadMore} stopObserver={stopObserver} />
        </ScrollViewContents>
      </ScrollHorizontal>
    </RecommendContents>
  );
}
const Scroll_View = styled.div`
  display: block;
  overflow: auto;
`;

const ScrollViewContents = styled.div`
  display: flex;
`;

const HashtagResult = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #232a3c;
  margin-right: 10px;
`;
const HashtagResultText = styled(HashtagResult)`
  color: #f8f9fa;
`;

const RecommendContents = styled.div`
  display: flex;
  // overflow-y: hidden;
  height: 220px;
  align-items: flex-end;
  // ::-webkit-scrollbar {
  //   /* width: 0px;
  //   height: 7px; */
  //   display: none;
  // }
`;

export default function InfiniteScroll({ isOdd }) {
  return <ScrollView></ScrollView>;
}
