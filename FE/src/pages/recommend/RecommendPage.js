import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled } from "@ant-design/icons";

import styled from "styled-components";

const ProjectItem = ({ el }) => {
  console.log("ProjectItem");
  return (
    <Link to={`project/${el._id}`}>
      <h1 style={{ fontSize: "25px" }}> {el.project_title}</h1>
    </Link>
  );
};

const RecommendPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const mainText = "마음에 드는 여행 프로젝트를\n 내 프로젝트로! 😆";

  // 업로드된 프로젝트를 가져온다.
  useEffect(() => {
    async function fetchUploadedProjects() {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`);
      return response.json();
    }
    fetchUploadedProjects();
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
`;

const RecommendContents = styled.div``;

const RecommendHome = styled(HomeFilled)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
  position: absolute;
`;

export default RecommendPage;
