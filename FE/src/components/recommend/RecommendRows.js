import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { throttle } from "lodash";

import styled from "styled-components";

const RecommendRows = () => {
  const [uploadProjectInfo, setUploadProjectInfo] = useState([]);
  const [skip, setSkip] = useState(0);

  // infinite scroll
  useEffect(() => {
    const fetchUploadProjectInfo = async () => {
      try {
        const request = await fetch(`${process.env.REACT_APP_SERVER_IP}:8443/recommend/infinite?skip=${skip}`);
        const uploadProjectInfoJson = await request.json();
        setUploadProjectInfo([...uploadProjectInfo, ...uploadProjectInfoJson]);
        // console.log("인피니트 스크롤 결과");
        // console.log(uploadProjectInfoJson);
        if (uploadProjectInfoJson.length === 0) {
          setSkip(0);
        }
      } catch (e) {
        console.log("말도안돼 T_T");
      }
    };
    fetchUploadProjectInfo();
  }, [skip]);

  var throttle = function (func, delay) {
    return function () {
      var timer = null;
      var clientHeight = document.body.clientHeight;
      var scrollTop = document.body.scrollTop;
      var scrollHieght = document.body.scrollHeight;
      // console.log(clientHeight, scrollTop, scrollHieght);
      if (scrollHieght - clientHeight - scrollTop < 200) {
        timer = setTimeout(func, delay);
        // setSkip(uploadProjectInfo.length % 10);
      }
    };
  };

  const handleScroll = throttle(function (e) {
    try {
      const { offsetHeight, scrollTop, scrollHeight } = e.target;
      if (offsetHeight + scrollTop === scrollHeight) {
        setSkip(uploadProjectInfo.length);
      }
    } catch (err) {}
  }, 10000);

  const ScrollRow = ({ el }) => {
    const defaultHashTags = ["제주도", "여행"];
    return (
      <div>
        <Link to={`project/${el._id}`}>
          <RecommendItems>
            <div className="background-img" style={{ backgroundImage: `url(${el.img})` }}>
              <div className="uploadProjectInfo-title">{el.project_title}</div>
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
            </div>
          </RecommendItems>
        </Link>
      </div>
    );
  };

  return (
    <div className="scrollWrapper">
      <HashtagResultTextDark>🏝 모든 프로젝트</HashtagResultTextDark>
      <RecommendContents onWheel={handleScroll}>
        {uploadProjectInfo.map((el, i) => {
          return i % 2 === 0 ? null : <ScrollRow key={i} el={el} />;
        })}
      </RecommendContents>
      <RecommendContents onWheel={handleScroll}>
        {uploadProjectInfo.map((el, i) => {
          return i % 2 === 0 ? <ScrollRow key={i} el={el} /> : null;
        })}
      </RecommendContents>
    </div>
  );
};
const RecommendItems = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  margin-right: 20px;
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
    padding-top: 40px;
  }
  .uploadProjectInfo-hashTags {
    font-size: 15px;
    color: #7c8289;
    text-align: center;
    margin-top: 33px;
    background: white;
    border-radius: 0px 0px 10px 10px;
    height: 62px;
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
const HashtagResultTextDark = styled(HashtagResultText)`
  color: #232a3c;
`;
const RecommendContents = styled.div`
  margin-top: 20px;
  height: 206px;
  display: flex;
  overflow-y: hidden;
  ::-webkit-scrollbar {
    /* width: 0px;
    height: 7px; */
    display: none;
  }
`;
export default RecommendRows;
