import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import HorizontalScroll from "react-scroll-horizontal";

const { Option } = Select;

import styled from "styled-components";

let hashTag = [];
fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtags`, {
  method: "get",
  headers: {
    "content-type": "application/json",
  },
  credentials: "include",
})
  .then((res) => res.json())
  .then((res) => (hashTag = res));

const RecommendPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [hashtags, setHashTags] = useState([]);
  const mainText = "마음에 드는 여행 프로젝트를\n 내 프로젝트로! 😆";

  // infinite scroll
  const [uploadProjectInfo, setUploadProjectInfo] = useState([]);
  const [skip, setSkip] = useState(0);

  let uploadedProjectsInfo = null;

  const children = [];
  for (let i = 0; i < hashTag.length; i++) {
    children.push(<Option key={hashTag[i] + i}>{hashTag[i]}</Option>);
  }

  const handleChange = (value) => {
    setHashTags(String(value).replace(/[0-9]/g, ""));
    console.log(value.keyCode);
  };

  async function searchHashtags() {
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(hashtags)}`;
    if (!hashtags.length) {
      url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`;
    }
    const response = await fetch(url, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setItems(res);
      });
  }
  // // 업로드된 프로젝트를 가져온다.
  // useEffect(() => {
  //   async function fetchUploadedProjects() {
  //     const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`, {
  //       method: "get",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //       credentials: "include",
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         setItems(res);
  //       });
  //   }
  //   fetchUploadedProjects();
  // }, []);

  // infinite scroll
  useEffect(() => {
    const fetchUploadProjectInfo = async () => {
      try {
        const request = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend?skip=${skip}`);
        const uploadProjectInfoJson = await request.json();
        setUploadProjectInfo([...uploadProjectInfo, ...uploadProjectInfoJson]);
        console.log(uploadProjectInfoJson);
      } catch (e) {
        console.log("말도 안돼 ㅜ_ㅜ");
      }
    };
    fetchUploadProjectInfo();
  }, [skip]);

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;

    if (offsetHeight + scrollTop === scrollHeight) {
      setSkip(uploadProjectInfo.length);
    }
  };

  const ScrollRow = ({ i, el }) => {
    console.log("i");
    console.log("el");
    return (
      <Link to={`project/${el._id}`}>
        <RecommendItems>
          <div className="uploadProjectInfo-title">{el.project_title}</div>
          <div className="uploadProjectInfo-hashTags">
            {el.hashTags.map((hashTag, index) => (
              <span key={index}>
                {"#"}
                {hashTag}{" "}
              </span>
            ))}
          </div>
        </RecommendItems>
      </Link>
    );
  };

  return (
    <RecommendWrapper>
      <SearchBlock>
        <Home>
          <RecommendHome>
            onClick=
            {() => {
              navigate("/");
            }}
          </RecommendHome>
          <Logo>놀멍쉬멍</Logo>
        </Home>
        <StyledDiv>
          <SelectModal
            mode="multiple"
            placeholder="최대 다섯개의 해시태그를 입력해주세요. ex) 우도, 맛집탐방"
            onChange={handleChange}

            // onSelect={searchHashtags}
            // onSearch={inputChange}
            // onInputKeyDown={(event)=>{if(event.keyCode === 13){searchHashtags()}}}
          >
            {children}
          </SelectModal>
          <SelectIcon onClick={searchHashtags} />
        </StyledDiv>
      </SearchBlock>

      <RecommendBlock>
        {mainText}
        <div className="scrollWrapper">
          <RecommendContents onWheel={handleScroll}>
            <HorizontalScroll reverseScroll={true}>
              {uploadProjectInfo.map((el, i) => {
                return <ScrollRow key={i} el={el} />;
              })}
            </HorizontalScroll>
          </RecommendContents>
          <RecommendContents onWheel={handleScroll}>
            <HorizontalScroll reverseScroll={true}>
              {uploadProjectInfo.map((el, i) => {
                return <ScrollRow key={i} el={el} />;
              })}
            </HorizontalScroll>
          </RecommendContents>
        </div>
      </RecommendBlock>
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
  // width:50%
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecommendWrapper = styled.div`
  background-color: #ff8a3d;
  width: 100%;
`;

const SearchBlock = styled.div`
  background-color: white;
  height: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: space-between;
`;

const RecommendBlock = styled.div`
  font-size: 50px;
  white-space: pre-line;
  font-weight: 700;
  color: white;
  padding: 8vh;
  letter-spacing: 1px;
  line-height: 65px;
  min-width: 800px;

  .scrollWrapper {
    margin-top: 130px;
  }
`;

const RecommendContents = styled.div`
  margin-top: 20px;
  height: 206px;
`;

const RecommendItems = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  margin-right: 20px;
  cursor: pointer;
  box-shadow: 4px 4px 4px rgb(0 0 0 / 25%);
  .uploadProjectInfo-title {
    font-size: 25px;
    color: black;
    text-align: center;
    padding: 30px;
  }
  .uploadProjectInfo-hashTags {
    font-size: 15px;
    color: #7c8289;
    text-align: center;
  }
`;

const RecommendHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
  // position: absolute;
`;

const SelectIcon = styled(SearchOutlined)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
  // margin-right: 0;
`;

const SelectModal = styled(Select)`
  // width: 50%;
  width: 400px;
  // margin-right: 100px;
  // position: relative;
`;

export default RecommendPage;
