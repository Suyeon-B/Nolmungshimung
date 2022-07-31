import { useState, useEffect } from "react";
import ResultMap from "../../components/MarkMap/resultMap";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import GetProjectModal from "../../components/recommendModal/GetProjectModal";
import SearchDetail from "../../components/searchMap/SearchDetail";
import { spotDetail } from "../../components/spot/SpotDetail";

const randomRGB = function () {
  return Math.round(Math.random() * 0xffffff).toString(16);
};
const colorArr = [];

for (let i = 0; i < 100; i++) {
  colorArr.push(`#${randomRGB()}`);
}

const RecommendPageDetail = () => {
  const { projectId } = useParams();

  const [title, setTitle] = useState(null);
  const [routes, setRoutes] = useState(null); // routes -> [[route],[route],[route]...]
  const [visible, setVisible] = useState(false);
  const [contents, setContents] = useState(null);
  const [hashtags, setHashtags] = useState(null);

  const showDrawer = async (route) => {
    const data = {
      input: route.road_address_name + "" + route.place_name,
      place_id: route.id,
      place_name: route.place_name,
      road_address_name: route.road_address_name ? route.road_address_name : route.address_name,
      category_group_name: route.category_group_name,
      phone: route.phone,
      place_url: route.place_url,
    };

    var detail = await spotDetail(data);

    if (detail) {
      setContents(detail);
      setVisible(true);
    }
  };

  async function fetchProjectById(_id) {
    const response = await fetch(`https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/projects/${_id}`);
    return response.json();
  }

  const onClose = () => {
    setVisible(false);
    setContents(null);
  };

  useEffect(() => {
    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);
      setHashtags(data.hashTags);
      setRoutes(data.routes);
      setTitle(data.project_title);
    }
    fetchInfo();
    return () => {};
  }, [projectId]);
  console.log(hashtags);
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
        <Hashtags>
          <div className="hashtagsWrapper">
            {hashtags &&
              hashtags.map((hashtag, idx) => {
                return (
                  <span key={idx}>
                    {" #"}
                    {hashtag}
                  </span>
                );
              })}
          </div>
        </Hashtags>
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
                  <ResultRoute key={el.uid} onClick={() => showDrawer(el)}>
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
        {contents !== null && <SearchDetail onClose={onClose} visible={visible} contents={contents} />}
      </ResultContainer>
      <ResultMap routes={routes} colorArr={colorArr} />
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
const Hashtags = styled.div`
  display: flex;
  width: 100%;
  height: 3.5vh;

  align-items: center;

  background: whitesmoke;
  margin-bottom: 2vh;
  border-radius: 3px;

  .hashtagsWrapper {
    text-overflow: ellipsis;
    font-weight: 700;
    height: inherit;
    white-space: nowrap;
    color: #565656;
    word-wrap: normal;
    width: 100%;
    overflow: hidden;
    padding: 1vh;
  }
`;

export default RecommendPageDetail;
