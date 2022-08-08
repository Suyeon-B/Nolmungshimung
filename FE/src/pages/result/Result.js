import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ResultMap from "../../components/MarkMap/resultMap";
import { CloseOutlined } from "@ant-design/icons";
import ResultModal from "./ResultModal";
import Badge from "../../atomics/Badge";
import ShowMemoResult from "./ResultMemo";

const color = {
  FD6: "#975FFE",
  AT4: "#FF8A3D", // 관광, 명소
  CE7: "#FF6169", // 음식점>카페
  AD5: "#8DD664", // 숙박
  "": "#CFCFCF",
};

const randomRGB = function () {
  return Math.round(Math.random() * 0xffffff).toString(16);
};
const colorArr = [];

for (let i = 0; i < 100; i++) {
  colorArr.push(`#${randomRGB()}`);
}

function Result() {
  const { projectId } = useParams();
  const [hashTags, setHashTags] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [routes, setRoutes] = useState(null); // routes -> [[route],[route],[route]...]

  const [projectInfo, setProjectInfo] = useState(null);

  // const colorRef = useRef([]);

  // route -> [{spotInfo},{spotInfo},{spotInfo}...]
  const showModal = () => {
    setVisible(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    const reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

    Object.keys(hashTags).forEach((k) => {
      hashTags[k] = hashTags[k].replaceAll(reg, "").trim();
      if (hashTags[k].length === 0) {
        hashTags[k] === null;
      }
    });
    // console.log(Object.keys(hashTags).length);
    // console.log(hashTags);
    // console.log(projectInfo);
    if (hashTags.length > 5) {
      Badge.fail("업로드 실패", "5개 이하로 입력바랍니다.");
      setConfirmLoading(false);
      return;
    } else {
      if (routes[0].length > 0) {
        // console.log(routes[0][0].id);
        projectInfo.travelId = routes[0][0].id;
      }
      // console.log(projectInfo);
      // Object.keys(hashTags).forEach((k) => {
      //   hashTags[k] = hashTags[k].replaceAll("#", "").trim();
      // });
      // console.log(hashTags);
      projectInfo.hashTags = hashTags;
      await fetch(
        `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/upload`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(projectInfo),
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        });
    }
    setVisible(false);
    setConfirmLoading(false);
    Badge.success("업로드 성공");
    window.location.replace("/recommend");
  };

  const handleCancel = () => {
    setVisible(false);
  };
  async function fetchProjectById(_id) {
    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`
    );
    return response.json();
  }

  useEffect(() => {
    if (projectId === null) return;
    async function fetchInfo() {
      const data = await fetchProjectById(projectId);
      setRoutes(data.routes);
      setProjectInfo(data);
      setTitle(data.project_title);
      setStartDate(data.start_date.join(".").slice(0, -2));
    }
    fetchInfo();

    return () => {};
  }, [projectId]);

  const culTripTermData = (startDate, day) => {
    const sDate = new Date(startDate);
    const dayArr = ["일", "월", "화", "수", "목", "금", "토"];

    sDate.setDate(sDate.getDate() + day);

    return `${sDate.getFullYear() - 2000}. ${
      sDate.getMonth() + 1
    }. ${sDate.getDate()} ${dayArr[sDate.getDay()]}`;
  };

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
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseOutlined
              style={{ color: "red", fontWeight: "900", fontSize: "30px" }}
              onClick={() => {
                window.history.back();
              }}
            />
            <ResultXTitle> 전체 여행 경로</ResultXTitle>
          </div>
          <UploadBtn onClick={showModal}>업로드</UploadBtn>
          <ResultModal
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            setHashTags={setHashTags}
            hashTags={hashTags}
          />
        </div>
        <br />
        <br />
        <ResultProjectTitle>{title}</ResultProjectTitle>
        {routes &&
          routes.map((route, idx) => {
            return route.length !== 0 ? (
              <div key={route[0].uid}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1}
                  <StyledSpan>{culTripTermData(startDate, idx)}</StyledSpan>
                  <br />
                </ResultTitle>
                {route.map((el, index) => (
                  <StyledTitleContainer key={el.uid + "1"}>
                    <StyledTitlecircle
                      // randomRGB={colorArr[idx]}
                      style={{
                        background: color[el.category_group_code],
                      }}
                    >
                      {index + 1}
                    </StyledTitlecircle>
                    <ResultRoute>
                      {el.place_name}
                      <br />
                    </ResultRoute>
                  </StyledTitleContainer>
                ))}
              </div>
            ) : (
              <div key={idx + 999}>
                <ResultLine />
                <ResultTitle>
                  DAY {idx + 1}
                  <StyledSpan>{culTripTermData(startDate, idx)}</StyledSpan>
                  <br />
                </ResultTitle>
                <ResultRoute
                  style={{
                    color: "gray",
                  }}
                >
                  쉬는 날 🌱
                  <br />
                </ResultRoute>
              </div>
            );
          })}
        <ResultLine />
        <ResultTitle>Memo</ResultTitle>
        <ResultMemoBox>
          <ShowMemoResult project_info={projectInfo} />
        </ResultMemoBox>
      </ResultContainer>
      <ResultMap routes={routes} colorArr={colorArr} />
    </ResultWhole>
  );
}

const StyledSpan = styled.span`
  color: #7c8289;
  margin-left: 10px;
  font-size: 22px;
`;

const StyledTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
  /* border-bottom: 1px solid black; */
`;

const StyledTitlecircle = styled.div`
  display: inline-flex;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  font-size: 12px;
  margin-right: 10px;
  color: white;
  justify-content: center;
  align-items: center;
  border: ${(props) => `2px solid ${props.randomRGB}`};
  /* 2px solid red; */
`;

const ResultWhole = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ResultImage = styled.img`
  right: 0;
  top: 0;
  width: calc(100vw-400px);
  height: 100vh;
  resize: cover;

  background-repeat: no-repeat;
`;

const ResultProjectTitle = styled.span`
  font-style: normal;
  font-weight: 900;
  font-size: 35px;
  line-height: 36px;
  color: #ff8a3d;
`;

const ResultXTitle = styled.span`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`;

const ResultTitle = styled.section`
  font-style: normal;
  font-weight: 800;
  font-size: 25px;
  line-height: 36px;
  margin-bottom: 12px;
`;

const ResultLine = styled.div`
  border-bottom: 2px solid #c1c7cd;
  margin-bottom: 25px;
  margin-top: 20px;
`;

const ResultRoute = styled.li`
  list-style: none;
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 29px;
  /* margin-bottom: 9px; */
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

const UploadBtn = styled.button`
  /* margin-left: 129.5px;
  line-height: 36px; */
  height: 40px;
  border: 0;
  font-weight: 600;
  font-size: 17px;
  color: #f8f9fa;
  cursor: pointer;
  background-color: #ff8a3d;
  border-radius: 5px;
  padding: 3px 8px 3px 8px;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 2px #aaaaaa;
  &:hover {
    background: rgba(255, 122, 0, 0.4);
    transition: background 0.3s ease, color 0.1s ease;
  }
  &:active {
    box-shadow: none;
  }
`;

const ResultMemoBox = styled.div`
  height: 100%;
  overflow-y: auto;
  min-height: 20vh;
  background-color: #f8f9fa;
  border-color: #c1c7cd;
  border-radius: 10px;
  border-style: solid;
  border-width: 2px;
  padding: 15px;

  .memoText {
    white-space: pre-wrap;
    word-break: break-all;
  }
`;

export default React.memo(Result);
