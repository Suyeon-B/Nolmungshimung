import React, { useEffect, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";
import SearchHashTags from "../../components/recommend/SearchHashTags";
import styled from "styled-components";

const RecommendPage = () => {
  const InfiniteScroll = React.lazy(() => import("../../components/recommend/InfiniteScroll"));
  const navigate = useNavigate();
  const mainText = "마음에 드는 여행코스를\n 내 여행일정으로 가져와보세요! 😆";
  const [hashTag, setHashTag] = useState(null);

  useEffect(() => {
    const loadHashTags = async () => {
      await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtags`, {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setHashTag(res);
          console.log(res);
        })
        .catch((e) => console.log("왜??", e));
    };
    loadHashTags();
  }, []);

  if (hashTag === null) {
    return <div>loading...</div>;
  }

  return (
    <RecommendWrapper>
      <SearchBlock>
        <Home>
          <RecommendHome
            onClick={() => {
              navigate("/");
            }}
          />
          <Logo>놀멍쉬멍</Logo>
        </Home>
        <SearchHashTags hashTag={hashTag} />
      </SearchBlock>
      <div className="ScrollWrapper" id="default">
        <MainText>{mainText}</MainText>
        <TextDark>🏝 모든 여행코스</TextDark>
        <RecommendBlock>
          <div className="scrollOdd">
            <Suspense fallback={<div>Loading...</div>}>
              <InfiniteScroll />
            </Suspense>
          </div>
          <div className="scrollEven">
            <Suspense fallback={<div>Loading...</div>}>
              <InfiniteScroll />
            </Suspense>
          </div>
        </RecommendBlock>
      </div>
      <div className="ScrollWrapper" id="searched">
        <RecommendBlock>
          <MainText>{mainText}</MainText>
          <SearchHashTags />
        </RecommendBlock>
      </div>
    </RecommendWrapper>
  );
};

const Home = styled.div`
  display: flex;
  align-items: center;
`;
const Logo = styled.div`
  color: #ff8a3d;
  font-size: 20px;
  font-weight: bold;
  min-width: fit-content;
`;

const HashtagResult = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #232a3c;
  margin-right: 10px;
  padding-top: 6vh;
`;
const HashtagResultText = styled(HashtagResult)`
  color: #f8f9fa;
`;
const TextDark = styled(HashtagResultText)`
  color: #232a3c;
  min-width: max-content;
`;

const RecommendWrapper = styled.div`
  background-color: #ff8a3d;
  width: 100%;

  .ScrollWrapper {
    padding: 6vh;
  }

  div#searched {
    display: none;
  }
`;

const SearchBlock = styled.div`
  background-color: white;
  height: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
`;

const RecommendBlock = styled.div`
  min-width: 20vw;
  width: 92.5vw;

  .resultTextWrapper {
    display: flex;
  }
`;

const MainText = styled.div`
  font-size: 50px;
  white-space: pre-line;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  line-height: 65px;
  min-width: 500px;
`;

const RecommendHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
`;

export default React.memo(RecommendPage);
