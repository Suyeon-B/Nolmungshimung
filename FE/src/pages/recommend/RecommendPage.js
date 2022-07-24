import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled, FileSearchOutlined } from "@ant-design/icons";
import { Select } from "antd";

const { Option } = Select;


import styled from "styled-components";

const ProjectItem = ({ el }) => {
  // console.log("ProjectItem");
  return (
    <Link to={`project/${el._id}`}>
      <RecommendItems>
        <div className="recommend_project_title"> {el.project_title}</div>
        <div className="recommend_project_hashtag"> #{el.hashTags}</div>
      </RecommendItems>
    </Link>
  );
};

let hashTag = [];
fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtags`, {
  method: "get",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
  })
  .then((res) => res.json())
  .then((res) => hashTag = res)

const RecommendPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [hashtags, setHashTags] = useState([]);
  const mainText = "마음에 드는 여행 프로젝트를\n 내 프로젝트로! 😆";
  
  let uploadedProjectsInfo = null;

  const children = [];
  for (let i = 0; i < hashTag.length; i++) {
    children.push(<Option key={hashTag[i]+i}>{hashTag[i]}</Option>);
  }

  const handleChange = (value) => {
    setHashTags(String(value).replace(/[0-9]/g, ""));
  };

  async function searchHashtags(){
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(hashtags)}`
    if (!hashtags.length){
      url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`
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
    })
  }
  // 업로드된 프로젝트를 가져온다.
  useEffect(() => {
    async function fetchUploadedProjects() {
      const response = await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`,
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
          // console.log("===== fetch 결과 =====");
          // console.log(res);
          setItems(res);
          // console.log(items);
        });
      // setItems(response);
      // console.log(response.json());
      // return response.json();
    }
    fetchUploadedProjects();
    // console.log(items);
  }, []);

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
          mode="multiple"
          placeholder="최대 다섯개의 해쉬태그를 입력해주세요. ex) 우도, 맛집탐방"
          onChange={handleChange}
          // onSearch={inputChange}
      >
        {children}
        {/* {autotexts} */}
      </SelectModal>
      <SelectIcon
        onClick={searchHashtags}/>

      <RecommendBlock>
        {mainText}
        <RecommendContents>
          {items.map((el, i) => {
            return <ProjectItem key={i} el={el} />;
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
  .recommend_project_title {
    font-size: 25px;
    color: black;
    text-align: center;
    padding: 30px;
  }
  .recommend_project_hashtag {
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
