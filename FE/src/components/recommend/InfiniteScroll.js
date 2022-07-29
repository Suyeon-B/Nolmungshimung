import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Observer({ onIntersect, stopObserver }) {
  // console.log(stopObserver);
  if (stopObserver == true) return;
  const ref = useRef(null);

  useEffect(() => {
    let node = ref.current;
    if (node !== null) {
      let options = {
        root: null,
        routeMargin: "100px",
        threshold: 0.5,
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
        width: "100%",
        height: "200px",
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

  const ScrollRow = ({ el }) => {
    const defaultHashTags = ["제주도", "여행"];
    return (
      <StyledDiv>
        <Link to={`project/${el._id}`}>
          <RecommendItems>
            <div className="background-img" style={{ backgroundImage: `url(${el.img})` }}>
              <div className="uploadProjectInfo-title">{el.project_title}</div>
              <HashTagBackground>
                <div className="uploadProjectInfo-hashTags">
                  {el.hashTags.length === 0
                    ? defaultHashTags.map((hashTag, index) => (
                        <span key={index}>
                          {"#"}
                          {hashTag}{" "}
                        </span>
                      ))
                    : el.hashTags.map((hashTag, index) => (
                        <span key={index}>
                          {"#"}
                          {hashTag}{" "}
                        </span>
                      ))}
                </div>
              </HashTagBackground>
            </div>
          </RecommendItems>
        </Link>
      </StyledDiv>
    );
  };

  return (
    <RecommendContents>
      <ScrollViewContents>
        {uploadProjectInfo.map((el, i) => {
          return <ScrollRow key={i} el={el} />;
        })}
      </ScrollViewContents>
      <Observer onIntersect={loadMore} stopObserver={stopObserver} />
    </RecommendContents>
  );
}

const StyledDiv = styled.div`
  bottom: 0px;
  transition: bottom 0.3s;
  margin: 10px 20px 10px 0px;

  &:hover {
    position: relative;
    bottom: 10px;
  }
`;

const ScrollViewContents = styled.div`
  display: flex;
`;

const RecommendItems = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  background: #232a3c;

  .background-img {
    height: 200px;
    width: 200px;
    border-radius: 10px;
    box-shadow: 4px 4px 4px rgb(0 0 0 / 25%);
    background-position: center;
  }

  .uploadProjectInfo-title {
    font-size: 25px;
    color: #f8f9fa;
    text-align: center;
    padding-top: 60px;
  }
  .uploadProjectInfo-hashTags {
    font-size: 15px;
    color: #7c8289;
    text-align: center;
    padding: 23.5px;
  }
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

const HashTagBackground = styled.div`
  margin-top: 53px;
  background: white;
  border-radius: 0px 0px 10px 10px;
  height: 62px;
`;

const RecommendContents = styled.div`
  display: flex;
  overflow-y: hidden;
  height: 220px;
  align-items: flex-end;
  ::-webkit-scrollbar {
    /* width: 0px;
    height: 7px; */
    display: none;
  }
`;

export default function InfiniteScroll({ isOdd }) {
  return <ScrollView></ScrollView>;
}
