import { Button, Modal, Select } from "antd";
import React, { useState } from "react";
const { Option } = Select;
const hashTag = [
  "우도",
  "한라산",
  "맛집",
  "카페",
  "등산",
  "바다",
  "드라이빙",
  "데이트",
  "코스",
  "스쿠버",
  "다이빙",
];
const ResultModal = ({
  visible,
  onOk,
  confirmLoading,
  onCancel,
  setHashTags,
}) => {
  const children = [];

  for (let i = 0; i < hashTag.length; i++) {
    children.push(<Option key={i + 1}>{hashTag[i]}</Option>);
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setHashTags(value);
    console.log(value.length);
  };
  return (
    <>
      <Modal
        title="업로드하기"
        visible={visible}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
      >
        <Select
          mode="tags"
          style={{
            width: "100%",
          }}
          placeholder="최대 다섯개의 해시태그를 입력해주세요. ex) 우도, 맛집탐방"
          onChange={handleChange}
        >
          {children}
        </Select>
      </Modal>
    </>
  );
};

export default React.memo(ResultModal);
