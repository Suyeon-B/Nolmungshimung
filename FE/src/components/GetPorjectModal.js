import { Button, Modal } from "antd";
import React, { useState } from "react";
import ModalCalender from "./ModalCalendar";
import { useAuth } from "./auth/Auth";
import { useParams, useNavigate } from "react-router-dom";

const App = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [projectTitle, setProjectTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const auth = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const setDay = (value) => {
    return [
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
      value.getDay(),
    ];
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async (event) => {
    // api로 보내기
    //   {
    //     "projectId": "62dce3f97710afeda7945a36",
    //     "userId": "62d266f9b7a49e5c97e980ab",
    //     "startDate": [
    //         2022,
    //         7,
    //         26,
    //         0
    //     ],
    //     "projectTitle": "가져온프로젝트"
    // }
    console.log(auth);
    event.preventDefault();
    const data = {
      projectId,
      userId: auth.user._id,
      userName: auth.user.user_name,
      userEmail: auth.user.user_email,
      startDate: setDay(startDate),
      projectTitle,
    };
    console.log(data);

    const response = await fetch(
      `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`,
      {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (response.ok) {
      console.log("프로젝트로 이동시키기");
      const resData = await response.json();
      console.log(resData);
      navigate(`/project/${resData.projectId}`, { replace: false });
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };

  const onChange = (event) => {
    setProjectTitle(event.target.value);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        내 프로젝트로 가져오기
      </Button>
      <Modal
        title="내 프로젝트로 가져오기"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <form type="submit">
          <input
            type="text"
            name=""
            id=""
            placeholder="여행 제목을 입력해주세요"
            value={projectTitle}
            onChange={onChange}
          />
          <p>여행 시작 날짜 선택</p>
          <ModalCalender startDate={startDate} setStartDate={setStartDate} />
        </form>
      </Modal>
    </>
  );
};

export default App;
