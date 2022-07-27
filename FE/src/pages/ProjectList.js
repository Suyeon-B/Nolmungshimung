import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../components/auth/Auth";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircleTwoTone } from "@ant-design/icons";

const ProjectList = ({ goProject }) => {
  const [items, setItems] = useState([]);
  const auth = useAuth();
  let projectsInfo = null;

  const onDelete = async (event) => {
    if (confirm("프로젝트를 삭제하시겠어요??")) {
      const projectId = event.target.dataset.id
        ? event.target.dataset.id
        : event.target.parentNode.dataset.id;

      console.log(projectId);
      const data = {
        _id: auth.user._id,
      };
      console.log(event.target);
      const response = await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}/projects/${projectId}`,
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
        <StyledBtn data-id={el._id} onClick={onDelete}>
          <svg
            data-id={el._id}
            className="planListTrashCan"
            fill="#7C8289"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              data-id={el._id}
              d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z"
            />
          </svg>
        </StyledBtn>
      </StyledLi>
    );
  };

  useEffect(() => {
    if (auth.user === undefined || auth.user === null) return;
    console.log("여기", auth.user);
    // auth.user 불러오질 못함.
    // 세션은 ..? 안됨
    // -> auth.user가 변경될때마다 재랜더링 ㄲ
    let projects = auth.user?.user_projects;

    async function fetchProjectList() {
      await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}/projects/title`,
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
      <TitleWrapper>
        <StyledTitle>내 프로젝트 목록</StyledTitle>
        <PlusCircleTwoTone
          onClick={goProject}
          style={{ fontSize: "30px" }}
          twoToneColor="#FF8A3D"
        />
      </TitleWrapper>

      <StyledLine></StyledLine>
      <StyledUl>
        {items.map((el, i) => {
          return <ProjectItem key={i} el={el} />;
        })}
      </StyledUl>
    </StyleProjectList>
  );
};

const StyledBtn = styled.button`
  outline: 0;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
`;

const StyledUl = styled.ul`
  margin-top: 20px;
  width: 100%;
`;

const StyledLi = styled.li`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 28px;
  line-height: 45px;
  margin-bottom: 10px;

  color: #000000;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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

export default React.memo(ProjectList);
