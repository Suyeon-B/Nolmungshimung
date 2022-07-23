import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../components/auth/Auth";
import { useNavigate, Link } from "react-router-dom";

const ProjectList = () => {
  const [items, setItems] = useState([]);
  const auth = useAuth();
  let projectsInfo = null;

  const onDelete = async (event) => {
    if (confirm("프로젝트를 삭제하시겠어요??")) {
      const projectId = event.target.dataset.id;
      const data = {
        _id: auth.user._id,
      };

      const response = await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${projectId}`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      location.reload();
    }
  };

  const ProjectItem = ({ el }) => {
    console.log("ProjectItem");
    return (
      <StyledLi>
        <Link to={`project/${el._id}`}>
          <h1 style={{ fontSize: "25px" }}> {el.project_title}</h1>
        </Link>
        <button data-id={el._id} onClick={onDelete}>
          삭제하기
        </button>
      </StyledLi>
    );
  };

  useEffect(() => {
    if (auth.user === undefined || auth.user === null) return;
    // auth.user 불러오질 못함.
    // 세션은 ..? 안됨
    // -> auth.user가 변경될때마다 재랜더링 ㄲ
    let projects = auth.user?.user_projects;

    async function fetchProjectList() {
      await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/title`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          // credentials: "include",
          body: JSON.stringify(projects),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.success === true) {
            projectsInfo = res.projectInfo;
            setItems(projectsInfo);
          }
        })
        .catch((err) => console.log(`err: ${err}`));
    }
    fetchProjectList();
    console.log(items);
  }, [auth.user]);

  return (
    <StyleProjectList>
      <StyledTitle>내 프로젝트 목록</StyledTitle>
      <StyledLine></StyledLine>
      <StyledUl>
        {items.map((el, i) => {
          return <ProjectItem key={i} el={el} />;
        })}
      </StyledUl>
    </StyleProjectList>
  );
};

const StyledUl = styled.ul`
  margin-top: 20px;
`;

const StyledLi = styled.li`
  font-weight: 700;
  font-size: 28px;
  line-height: 45px;
  margin-bottom: 10px;

  color: #000000;
`;

const StyledTitle = styled.h1`
  width: 100%;
  height: 45px;

  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  /* identical to box height */

  color: #ff7a00;
`;

const StyledLine = styled.div`
  /* position: absolute; */
  width: 100%;
  height: 3px;
  /* left: 829px;
  top: 227px; */

  background: #d9d9d9;
`;

const StyleProjectList = styled.div`
  position: absolute;
  display: flex;
  width: 27%;
  height: 70%;
  background-color: rgba(255, 255, 255, 0.42);
  z-index: 2;
  top: 13vh;
  left: 55vw;
  padding: 19px 32px;
  border-radius: 10px;
  flex-direction: column;
  align-items: flex-start;
`;

export default ProjectList;
