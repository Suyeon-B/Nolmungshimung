import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled, FileSearchOutlined } from "@ant-design/icons";
import { Select } from "antd";

const { Option } = Select;

import styled from "styled-components";

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
  const hashTag = [];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setHashTags(value);
    console.log(value.length);
  };
  for (let i = 0; i < hashTag.length; i++) {
    children.push(<Option key={i + 1}>{hashTag[i]}</Option>);
  }
  async function searchHashtags() {
    console.log(hashtags);
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(hashtags)}`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
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

  return (
    <RecommendWrapper>
      <SearchBlock>
        <RecommendHome
          onClick={() => {
            navigate("/");
          }}
        />
      </SearchBlock>

      <SelectModal
        mode="tags"
        placeholder="최대 다섯개의 해시태그를 입력해주세요. ex) 우도, 맛집탐방"
        onChange={handleChange}
      ></SelectModal>
      <SelectIcon onClick={searchHashtags} />

      <RecommendBlock>
        {mainText}
        <RecommendContents onWheel={handleScroll}>
          {uploadProjectInfo.map((uploadProjectInfo) => {
            return (
              <Link to={`project/${uploadProjectInfo._id}`}>
                <RecommendItems>
                  <div className="uploadProjectInfo-title">{uploadProjectInfo.project_title}</div>
                  <div className="uploadProjectInfo-hashTags">#{uploadProjectInfo.hashTags}</div>
                </RecommendItems>
              </Link>
            );
          })}
        </RecommendContents>
      </RecommendBlock>
    </RecommendWrapper>
  );
};

const RecommendWrapper = styled.div`
  background-color: #ff8a3d;
  width: 100%;
`;

const SearchBlock = styled.div`
  background-color: white;
  height: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
`;

const RecommendContents = styled.div`
  display: flex;
  margin-top: 100px;
  overflow-y: hidden;
  height: 206px;
  ::-webkit-scrollbar {
    /* width: 0px;
    height: 7px; */
    display: none;
  }
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
    color: black;
    text-align: center;
  }
`;

const RecommendHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
  position: absolute;
`;

const SelectIcon = styled(FileSearchOutlined)`
  // color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
  // position: absolute;
`;

const SelectModal = styled(Select)`
  width: 50%;
  margin-left: auto;
  margin-right: 0;
  position: center;
`;

export default RecommendPage;
