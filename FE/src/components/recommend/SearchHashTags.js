import React, { useState } from "react";
import { Select } from "antd";
import styled from "styled-components";
import ScrollRow from "./ScrollRow";
import { SearchOutlined } from "@ant-design/icons";

const SearchHashTags = ({ hashTag }) => {
  console.log(hashTag);
  const [hashTagPJInfo, setHashTagPJInfo] = useState([]);
  const [hashtags, setHashTags] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const children = [];
  const { Option } = Select;
  if (hashTag) {
    for (let i = 0; i < hashTag.length; i++) {
      children.push(<Option key={hashTag[i] + i}>{hashTag[i]}</Option>);
    }
  }

  const handleChange = (value) => {
    setHashTags(String(value).replace(/[0-9]/g, ""));
    // console.log(value.keyCode);
  };

  async function getHashTags() {
    let url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend/hashtag?taglist=${JSON.stringify(hashtags)}`;
    if (!hashtags.length) {
      url = `https://${process.env.REACT_APP_SERVER_IP}:8443/recommend`;
    }
    try {
      setHashTagPJInfo([]);
      setIsSearched(true);
      const request = await fetch(url);
      const hashTagPJInfoJson = await request.json();
      setHashTagPJInfo([...hashTagPJInfoJson]);
      // console.log(hashtags);
      if (hashtags.length === 0) {
        // console.log("해시태그 없으니까 인피니트 나오거라");
        setIsSearched(false);
      }
      // console.log("해시태그 검색해서 나온 결과");
      // console.log(hashTagPJInfo);
    } catch (e) {
      console.log("해시태그야 일해라 ..");
    }
  }

  return (
    <div>
      <StyledDiv>
        <SelectModal
          mode="multiple"
          placeholder="최대 다섯개의 해시태그를 입력해주세요. ex) 우도, 맛집탐방"
          onChange={handleChange}
        >
          {children}
        </SelectModal>
        <SelectIcon onClick={getHashTags} />
      </StyledDiv>
      {isSearched && (
        <div>
          <div className="resultTextWrapper">
            <HashtagResult>#{hashtags}</HashtagResult>
            <HashtagResultText>검색 결과 🔍</HashtagResultText>
          </div>
          <RecommendContents>
            {hashTagPJInfo.map((el, i) => {
              return <ScrollRow el={el} key={i} />;
            })}
          </RecommendContents>
        </div>
      )}
    </div>
  );
};
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SelectModal = styled(Select)`
  width: 400px;
`;
const SelectIcon = styled(SearchOutlined)`
  color: #ff8a3d;
  font-size: 30px;
  padding: 10px;
`;
const RecommendContents = styled.div`
  margin-top: 20px;
  height: 206px;
  display: flex;
`;
const HashtagResult = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #232a3c;
  margin-right: 10px;
  padding-top: 6vh;
`;
const HashtagResultText = styled(HashtagResult)`
  color: #f8f9fa;
`;

export default React.memo(SearchHashTags);
