import React, { useEffect, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";
import ScrollRow from "../../components/recommend/ScrollRow";
import styled from "styled-components";
import InfiniteScroll from "../../components/recommend/InfiniteScroll";
import { Select } from "antd";

const RecommendPage = () => {
  // const InfiniteScroll = React.lazy(() => import("../../components/recommend/InfiniteScroll"));
  const navigate = useNavigate();
  const mainText = "마음에 드는 여행코스를\n 내 여행일정으로 가져와보세요! 😆";
  const [hashTag, setHashTag] = useState(null);
  const [hashTagPJInfo, setHashTagPJInfo] = useState([]);
  const [inputHashtags, setInputHashtags] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

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

  const children = [];
  const { Option } = Select;
  if (hashTag) {
    for (let i = 0; i < hashTag.length; i++) {
      children.push(<Option key={hashTag[i] + i}>{hashTag[i]}</Option>);
    }
  }

  const handleChange = (value) => {
    setInputHashtags(String(value).replace(/[0-9]/g, ""));
    // console.log(value.keyCode);
  };

  async function getHashTags() {
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(
      inputHashtags
    )}`;
    if (!inputHashtags.length) {
      url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`;
    }
    try {
      setHashTagPJInfo([]);
      setIsSearched(true);
      const request = await fetch(url);
      const hashTagPJInfoJson = await request.json();
      setHashTagPJInfo([...hashTagPJInfoJson]);
      // console.log(hashtags);
      if (inputHashtags.length === 0) {
        // console.log("해시태그 없으니까 인피니트 나오거라");
        setIsSearched(false);
      }
      // console.log("해시태그 검색해서 나온 결과");
      // console.log(hashTagPJInfo);
    } catch (e) {
      console.log("해시태그야 일해라 ..");
    }
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
        <StyledDiv>
          <SelectModal
            mode="multiple"
            placeholder="최대 다섯개의 해시태그를 입력해주세요. ex) 우도, 맛집탐방"
            onChange={handleChange}
          >
            {children}
          </SelectModal>
          <SelectIcon onClick={getHashTags} />
        </StyledDiv>
      </SearchBlock>
      {!isSearched && (
        <div className="ScrollWrapper">
          <MainText>{mainText}</MainText>
          <TextDark>🏝 모든 여행코스</TextDark>
          <RecommendBlock>
            <div className="scrollOdd">
              {/* <Suspense fallback={<div>Loading...</div>}> */}
              <InfiniteScroll />
              {/* </Suspense> */}
            </div>
            <div className="scrollEven">
              {/* <Suspense fallback={<div>Loading...</div>}> */}
              <InfiniteScroll />
              {/* </Suspense> */}
            </div>
          </RecommendBlock>
        </div>
      )}
      {isSearched && (
        <div className="ScrollWrapper">
          <RecommendBlock>
            <MainText>{mainText}</MainText>
            <div className="resultTextWrapper">
              <HashtagResult>#{inputHashtags}</HashtagResult>
              <HashtagResultText>검색 결과 🔍</HashtagResultText>
            </div>
            <HashTagSearchResult>
              {hashTagPJInfo.map((el, i) => {
                return <ScrollRow el={el} key={i} />;
              })}
            </HashTagSearchResult>
          </RecommendBlock>
        </div>
      )}
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
  margin-bottom: 10px;
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
  // margin-top: 20px;
  min-width: 20vw;
  width: 92.5vw;

  .resultTextWrapper {
    display: flex;
    margin-bottom: 10px;
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

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SelectModal = styled(Select)`
  width: 400px;
`;
const SelectIcon = styled(SearchOutlined)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
`;

const HashTagSearchResult = styled.div`
  // margin-top: 20px;
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

export default React.memo(RecommendPage);
