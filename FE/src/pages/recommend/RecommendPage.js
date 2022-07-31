import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";
import ScrollRow from "../../components/recommend/ScrollRow";
import styled from "styled-components";
import InfiniteScroll from "../../components/recommend/InfiniteScroll";
import ScrollHorizontal from "react-scroll-horizontal";
import { Select } from "antd";

const RecommendPage = () => {
  const navigate = useNavigate();
  const mainText = "마음에 드는 여행코스를\n 내 여행일정으로 가져와보세요! 😆";
  const defaultResultText = "검색 결과가 없어요.🥲";
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
          setHashTag(res);
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
    // getHashTags();
    setInputHashtags(String(value).replace(/[0-9]/g, ""));
    // console.log(value.keyCode);
    // console.log(value);
    // console.log(value);
    // console.log(inputHashtags);

    if (value.length === 0) {
      setIsSearched(false);
    }
    getHashTags();
  };

  async function getHashTags() {
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(
      inputHashtags
    )}`;
    if (!inputHashtags.length) {
      setIsSearched(false);
      return;
    }
    try {
      setHashTagPJInfo([]);
      setIsSearched(true);
      const request = await fetch(url);
      const hashTagPJInfoJson = await request.json();
      setHashTagPJInfo([...hashTagPJInfoJson]);
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
          <TextDark>🏝 모든 여행코스 확인하기 👀</TextDark>
          <RecommendBlock>
            <div className="scrollOdd">
              <InfiniteScroll isOdd={true} />
            </div>
            <div className="scrollEven">
              <InfiniteScroll isOdd={false} />
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
              {/* <ScrollHorizontal transition="0.2" reverseScroll="true"> */}
              {hashTagPJInfo.length > 0 ? (
                hashTagPJInfo.map((el, i) => {
                  return <ScrollRow el={el} key={i} />;
                })
              ) : (
                <DefaultResult>{defaultResultText}</DefaultResult>
              )}
              {/* </ScrollHorizontal> */}
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

const DefaultResult = styled.div`
  font-size: 23px;
  font-weight: normal;
  color: #232a3c;
  height: 200px;
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
  // color: #f8f9fa;

  color: #232a3c;
  min-width: max-content;
  margin-bottom: 10px;
`;

const RecommendWrapper = styled.div`
  white-space: pre-line;
  background-color: #ff8a3d;
  width: 100%;

  .ScrollWrapper {
    padding: 10vh;
    background: #ff8a3d;
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
  width: 88.5vw;

  .resultTextWrapper {
    display: flex;
    margin-bottom: 10px;
  }
`;

const MainText = styled.div`
  font-size: 50px;
  // white-space: pre-line;
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
