import React, { useEffect, useState, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";

const { Option } = Select;

import styled from "styled-components";

let hashTag = [];
fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtags`, {
  method: "get",
  headers: {
    "content-type": "application/json",
  },
  // credentials: "include",
})
  .then((res) => res.json())
  .then((res) => (hashTag = res))
  .catch((e) => console.log("왜??", e));

const RecommendPage = () => {
  const InfiniteScroll = React.lazy(() => import("../../components/recommend/InfiniteScroll"));
  const navigate = useNavigate();
  const [hashTagPJInfo, setHashTagPJInfo] = useState([]);
  const [hashtags, setHashTags] = useState([]);
  const mainText = "마음에 드는 여행코스를\n 내 여행일정으로 가져와보세요! 😆";
  const [isSearchResult, setIsSearchResult] = useState(false);

  const children = [];
  for (let i = 0; i < hashTag.length; i++) {
    children.push(<Option key={hashTag[i] + i}>{hashTag[i]}</Option>);
  }

  const handleChange = (value) => {
    setHashTags(String(value).replace(/[0-9]/g, ""));
    // console.log(value.keyCode);
  };

  async function searchHashtags() {
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(hashtags)}`;
    if (!hashtags.length) {
      url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`;
    }
    try {
      setHashTagPJInfo([]);
      setIsSearchResult(true);
      const request = await fetch(url);
      const hashTagPJInfoJson = await request.json();
      setHashTagPJInfo([...hashTagPJInfoJson]);
      // console.log(hashtags);
      if (hashtags.length === 0) {
        // console.log("해시태그 없으니까 인피니트 나오거라");
        setIsSearchResult(false);
      }
      // console.log("해시태그 검색해서 나온 결과");
      // console.log(hashTagPJInfo);
    } catch (e) {
      console.log("해시태그야 일해라 ..");
    }
  }

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
          <SelectIcon onClick={searchHashtags} />
        </StyledDiv>
      </SearchBlock>
      {!isSearchResult && (
        <div className="ScrollWrapper">
          <MainText>{mainText}</MainText>
          <HashtagResultTextDark>🏝 모든 여행코스</HashtagResultTextDark>
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
      )}
      {isSearchResult && (
        <div className="ScrollWrapper">
          <RecommendBlock>
            <MainText>{mainText}</MainText>
            <div className="resultTextWrapper">
              <HashtagResult>#{hashtags}</HashtagResult>
              <HashtagResultText>검색 결과 🔍</HashtagResultText>
            </div>

            <RecommendContents>
              {hashTagPJInfo.map((el, i) => {
                return <ScrollRow key={i} el={el} />;
              })}
            </RecommendContents>
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
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
const HashtagResultTextDark = styled(HashtagResultText)`
  color: #232a3c;
  min-width: max-content;
`;

const RecommendWrapper = styled.div`
  background-color: #ff8a3d;
  width: 100%;

  .ScrollWrapper {
    padding: 6vh;
  }
`;
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
    &:hover {
      box-shadow: none;
    }
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

const RecommendContents = styled.div`
  margin-top: 20px;
  height: 206px;
  display: flex;
`;

const RecommendHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
`;

const SelectIcon = styled(SearchOutlined)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
`;

const SelectModal = styled(Select)`
  width: 400px;
`;

export default RecommendPage;
