import { useState, useEffect } from "react";
import ResultMap from "../../components/MarkMap/resultMap";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import GetProjectModal from "../../components/recommendModal/GetProjectModal";

const RecommendPageDetail = () => {
  const { projectId } = useParams();

  const [title, setTitle] = useState(null);
  const [routes, setRoutes] = useState(null); // routes -> [[route],[route],[route]...]

  console.log(projectId);
  console.log("여기는 추천 프로젝트 디테일이지롱~~");

  async function fetchProjectById(_id) {
    const response = await fetch(
      `//${process.env.REACT_APP_SERVER_IP}/recommend/projects/${_id}`
    );
    return response.json();
  }

  useEffect(() => {
    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);
      setRoutes(data.routes);

      setTitle(data.project_title);
    }
    fetchInfo();
    return () => {};
  }, [projectId]);

  return (
    <ResultWhole>
      <ResultContainer>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <CloseOutlined
              style={{ color: "red", fontWeight: "900", fontSize: "30px" }}
              onClick={() => {
                window.history.back();
              }}
            />
            <ResultXTitle> &nbsp;&nbsp;&nbsp;전체 여행 경로</ResultXTitle>
          </div>
          <GetProjectModal routes={routes} />
        </div>
        <br />
        <br />
        <ResultProjectTitle>{title}</ResultProjectTitle>
        {routes &&
          routes.map((route, idx) => {
            return route.length !== 0 ? (
              <div key={idx + 1}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1} |
                  <br />
                </ResultTitle>{" "}
                {route.map((el, index) => (
                  <ResultRoute key={el.uid}>
                    {el.place_name}
                    <br />
                  </ResultRoute>
                ))}
              </div>
            ) : (
              <div key={idx + 1}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1} |
                  <br />
                </ResultTitle>
                <ResultRoute key={idx + 991}>
                  쉬는 날 🌱
                  <br />
                </ResultRoute>
              </div>
            );
          })}
      </ResultContainer>
      <ResultMap routes={routes} />
    </ResultWhole>
  );
};
const ResultWhole = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const ResultContainer = styled.div`
  display: flex;
  width: 400px;
  min-width: 400px;
  padding: 25px;
  height: 100vh;
  box-shadow: 5px 5px 5px 15px lightgray;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
const ResultXTitle = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`;
const ResultProjectTitle = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 900;
  font-size: 35px;
  line-height: 36px;
  color: #ff8a3d;
`;
const ResultLine = styled.div`
  border-bottom: 2px solid #c1c7cd;
  margin-bottom: 25px;
  margin-top: 20px;
`;
const ResultTitle = styled.section`
  font-family: "Inter";
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  line-height: 36px;
  margin-bottom: 12px;
`;
const ResultRoute = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 29px;
  marign-bottom: 9px;
`;

export default RecommendPageDetail;
