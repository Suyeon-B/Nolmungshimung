import { Drawer, Rate } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import "./Drawer.css";

const api_key = "AIzaSyAFeyVrH7cjDHGVVLqhifBI-DFlTUwEn8E";

const App = (s) => (
  <Rate style={{ marginBottom: "10px" }} disabled defaultValue={s} />
);
function SearchDetail(props) {
  const imgUrl = [];
  if (props.contents.photos) {
    props.contents.photos.map((el, idx) => {
      imgUrl.push(
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${el["photo_reference"]}&sensor=false&key=${api_key}`
      );
    });
  }
  console.log(imgUrl[0]);
  return (
    <Drawer
      title=""
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      width={450}
      className="site-form-in-drawer-wrapper"
    >
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <div>
          <StyledImg src={imgUrl[0]} />
        </div>

        <StyledTitle>{props.contents.place_name}</StyledTitle>
        <p
          style={{
            fontSize: "15px",
            fontStyle: "normal",
            color: "gray",
            marginTop: "14px",
            marginBottom: "5px",
          }}
        >
          {props.contents.category_group_name}
        </p>
        <StyleIcon>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="#FF8A3D"
            width="19"
            viewBox="0 0 384 512"
          >
            <path d="M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256z" />
          </svg>
        </StyleIcon>

        <StyleText>{props.contents.road_address_name}</StyleText>
        <p />
        <StyleIcon>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="#FF8A3D"
            width="22"
            viewBox="0 0 512 512"
          >
            <path d="M511.2 387l-23.25 100.8c-3.266 14.25-15.79 24.22-30.46 24.22C205.2 512 0 306.8 0 54.5c0-14.66 9.969-27.2 24.22-30.45l100.8-23.25C139.7-2.602 154.7 5.018 160.8 18.92l46.52 108.5c5.438 12.78 1.77 27.67-8.98 36.45L144.5 207.1c33.98 69.22 90.26 125.5 159.5 159.5l44.08-53.8c8.688-10.78 23.69-14.51 36.47-8.975l108.5 46.51C506.1 357.2 514.6 372.4 511.2 387z" />
          </svg>
        </StyleIcon>

        {props.contents.phone ? (
          <StyleText>{props.contents.phone}</StyleText>
        ) : (
          <span
            style={{
              fontSize: "15px",
              fontStyle: "normal",
              color: "gray",
            }}
          >
            -
          </span>
        )}
        <p />
        <StyleIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#FF8A3D"
            width="22"
            viewBox="0 0 576 512"
            className="icon"
          >
            <path d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z" />
          </svg>
        </StyleIcon>
        <StyleText>
          <a href={props.contents.place_url}>{props.contents.place_url}</a>
        </StyleText>
        <br />
        <hr />
        <div
          style={{
            fontSize: "18px",
            fontStyle: "board",
            marginTop: "15px",
            marginBottom: "5px",
          }}
        >
          리뷰 요약
        </div>
        {App(Math.floor(props.contents.rating))}
        <span> {props.contents.rating} / 5.0 점</span>
        <div
          style={{ fontSize: "18px", fontStyle: "board", marginBottom: "10px" }}
        >
          리뷰
        </div>
        {props.contents.reviews &&
          props.contents.reviews.map((item, index) => (
            <li>
              {item["author_name"]} : {item["text"]}
            </li>
          ))}
        <br />
        <a href={props.contents.place_url} target="_blank">
          {" "}
          후기 더보기 ...{" "}
        </a>
      </div>
    </Drawer>
  );
}

const StyledImg = styled.img`
  width: 300px;
  height: 280px;
  border-radius: 5px;
  margin-left: 5px;
`;

const StyledTitle = styled.h2`
  text-align: center;
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  margin-bottom: 14px;
  margin-top: 14px;
`;

const StyleText = styled.span`
  font-style: normal;
  font-size: 15px;
`;

const StyleIcon = styled.span`
  .icon {
    margin: 5px;
  }
`;

export default SearchDetail;
