import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ScrollRow = ({ el, i }) => {
  const defaultHashTags = ["제주도", "여행"];
  return (
    <StyledDiv>
      <Link to={`project/${el._id}`}>
        <RecommendItems>
          <div
            className="background-img"
            style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url(${el.img})` }}
          >
            <div className="uploadProjectInfo-title">{el.project_title}</div>
            <HashTagBackground>
              <div className="uploadProjectInfo-hashTags">
                {el.hashTags.length === 0
                  ? defaultHashTags.map((hashTag, index) => (
                      <span key={index}>
                        {"#"}
                        {hashTag}{" "}
                      </span>
                    ))
                  : el.hashTags.map((hashTag, index) => (
                      <span key={index}>
                        {"#"}
                        {hashTag}{" "}
                      </span>
                    ))}
              </div>
            </HashTagBackground>
          </div>
        </RecommendItems>
      </Link>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  bottom: 0px;
  transition: bottom 0.3s;
  margin: 10px 20px 10px 0px;

  &:hover {
    position: relative;
    bottom: 10px;
  }
`;

const RecommendItems = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  background: #232a3c;

  .background-img {
    height: 200px;
    width: 200px;
    border-radius: 10px;
    box-shadow: 4px 4px 4px rgb(0 0 0 / 25%);
    background-position: center;
  }

  .uploadProjectInfo-title {
    font-size: 25px;
    color: #f8f9fa;
    text-align: center;
    padding-top: 60px;
  }
  .uploadProjectInfo-hashTags {
    font-size: 15px;
    color: #7c8289;
    text-align: center;
    width: 190px;
    padding: 5px;
    margin-left: 5px;
    padding-top: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const HashTagBackground = styled.div`
  margin-top: 53px;
  background: white;
  border-radius: 0px 0px 10px 10px;
  height: 62px;
`;

export default React.memo(ScrollRow);
