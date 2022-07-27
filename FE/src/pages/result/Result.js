import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ResultMap from "../../components/MarkMap/resultMap";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import ResultModal from "./ResultModal";

function Result() {
  const { projectId } = useParams();
  const [hashTags, setHashTags] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [routes, setRoutes] = useState(null); // routes -> [[route],[route],[route]...]
  const [projectInfo, setProjectInfo] = useState(null);
  // route -> [{spotInfo},{spotInfo},{spotInfo}...]

  const showModal = () => {
    setVisible(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    // console.log(hashTags.length);
    // console.log(projectInfo);
    if (hashTags.length > 5) {
      alert("5개만 입력하랬다. ㅡㅡ");
      return;
    } else {
      if (routes[0].length > 0) {
        // console.log(routes[0][0].id);
        projectInfo.travelId = routes[0][0].id;
      }
      console.log(projectInfo);
      projectInfo.hashTags = hashTags;
      await fetch(`http://${process.env.REACT_APP_SERVER_IP}/projects/upload`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(projectInfo),
      }).then((res) => res.json());
    }
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      alert("완료되었다냥");
    }, 2000);
  };

  const handleCancel = () => {
    // console.log("Clicked cancel button");
    setVisible(false);
  };
  async function fetchProjectById(_id) {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_IP}/projects/${_id}`);
    return response.json();
  }

  useEffect(() => {
    if (projectId === null) return;
    // console.log(projectId);
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
    sDate.setDate(sDate.getDate() + day);
    return `${sDate.getFullYear()}. ${sDate.getMonth() + 1}. ${sDate.getDate()}`;
  };

  const ShowMemoResult = () => {
    let text = "로딩중 ...";
    if (projectInfo) {
      try {
        const textLines = projectInfo.quillRefEditor.length;
        for (var i = 0; i < textLines; i++) {
          text = projectInfo.quillRefEditor[i].insert;
        }
      } catch (err) {
        console.log("메모 로딩에 실패했습니다.");
      }
    }
    return <div className="memoText">{text}</div>;
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
          <div>
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
          />
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
                  DAY {idx + 1} | {culTripTermData(startDate, idx)}
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
                  DAY {idx + 1} | {culTripTermData(startDate, idx)}
                  <br />
                </ResultTitle>
                <ResultRoute key={idx + 991}>
                  쉬는 날 🌱
                  <br />
                </ResultRoute>
              </div>
            );
          })}
        {/* <ResultLine />
        <ResultTitle>Memo</ResultTitle>
        <ResultMemoBox>
          <ShowMemoResult />
        </ResultMemoBox> */}
      </ResultContainer>
      <ResultMap routes={routes} />
    </ResultWhole>
  );
}

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
  font-family: "Inter";
  font-style: normal;
  font-weight: 900;
  font-size: 35px;
  line-height: 36px;
  color: #ff8a3d;
`;

const ResultXTitle = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
`;

const ResultTitle = styled.section`
  font-family: "Inter";
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
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 29px;
  marign-bottom: 9px;
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
  font-family: "Inter";
  font-weight: 600;
  font-size: 17px;
  color: #f8f9fa;
  cursor: pointer;
  background-color: #ff8a3d;
  border-radius: 10px;
  padding: 3px 8px 3px 8px;
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
