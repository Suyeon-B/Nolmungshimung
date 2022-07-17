import { Drawer, Rate } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import "./Drawer.css";

const App = (s) => <Rate disabled defaultValue={s} />;
function SearchDetail(props) {
  console.log(props.contents);
  return (
    <Drawer
      title=""
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      width={380}
      className="site-form-in-drawer-wrapper"
    >
      {props.contents === null ? (
        <span>Null</span>
      ) : (
        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
          <StyledImg src={props.contents.img} />
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
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8ZGVmcz4KICA8Y2xpcFBhdGggaWQ9ImEiPgogICA8cGF0aCBkPSJtMjE2IDEzOS4yMWgzMjB2NDczLjU4aC0zMjB6Ii8+CiAgPC9jbGlwUGF0aD4KIDwvZGVmcz4KIDxnIGNsaXAtcGF0aD0idXJsKCNhKSI+CiAgPHBhdGggZD0ibTM3Ni4zIDYxMi43OWMtNTUuMzY3LTc1LjM5NS0xNjMuMTYtMjE3LjM1LTE1OS42My0zMTYuMzEgMi45NDUzLTgzLjY0MSA3My4wMzktMTU1LjUgMTU5LjYzLTE1Ny4yNyA4Ni41ODYgMS43NjU2IDE1Ni4wOSA3My42MjkgMTU5LjA0IDE1Ny4yNyAzLjUzNTIgOTguOTU3LTEwMy42NyAyNDAuOTEtMTU5LjA0IDMxNi4zMXptMC0zNTQuMDFjMjIuOTczIDAgNDEuODIgMTguODQ4IDQxLjgyIDQxLjgyIDAgMjIuOTczLTE4Ljg0OCA0MS44Mi00MS44MiA0MS44Mi0yMy41NjIgMC00MS44Mi0xOC44NDgtNDEuODItNDEuODIgMC0yMi45NzMgMTguMjYyLTQxLjgyIDQxLjgyLTQxLjgyeiIgZmlsbD0iI2ZmODcyZiIgZmlsbC1ydWxlPSJldmVub2RkIi8+CiA8L2c+Cjwvc3ZnPgo="
            style={{ width: "35px", height: "35px" }}
          />
          <StyleText>{props.contents.address_name}</StyleText>
          <p />
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8ZGVmcz4KICA8Y2xpcFBhdGggaWQ9ImEiPgogICA8cGF0aCBkPSJtMTM5LjIxIDEzOS4yMWg0NzMuNTh2NDczLjU4aC00NzMuNTh6Ii8+CiAgPC9jbGlwUGF0aD4KIDwvZGVmcz4KIDxnIGNsaXAtcGF0aD0idXJsKCNhKSI+CiAgPHBhdGggZD0ibTM5MC40NSAyNjEuMDYgNDkuOTY1IDQ5Ljk2NWMzLjcyMjcgMy43MTA5IDUuMjc3MyA5LjA3ODEgNC4xMTcyIDE0LjIwNy0xNS4yODEgNjQuMjE5LTU0Ljk5NiAxMDMuOTgtMTE5LjE1IDExOS4zLTUuMTI4OSAxLjE2MDItMTAuNDkyLTAuMzk4NDQtMTQuMjA3LTQuMTIxMWwtNTAuMTA1LTUwLjE5OS0xMTYuNTUgMTE2Ljc5Yy0zLjM4NjcgMy40NjA5LTUuMjg1MiA4LjEwOTQtNS4yODUyIDEyLjk1MyAwIDQuODM5OCAxLjg5ODQgOS40ODgzIDUuMjg1MiAxMi45NDlsNjYuMzAxIDY2LjMwMXYwLjAwMzkwN2MxMS4xMDkgMTEuMjIzIDI3LjIxOSAxNS45MyA0Mi42MjEgMTIuNDUzIDE5Mi41OS00Ni4wMzEgMzExLjkyLTE2NS4zNiAzNTcuOTgtMzU3Ljk4IDMuNTYyNS0xNS40OC0xLjE1MjMtMzEuNjk5LTEyLjQ1My00Mi44NTlsLTY2LjMwMS02Ni4zMDFoLTAuMDAzOTA2Yy0zLjQ1Ny0zLjM4NjctOC4xMDk0LTUuMjg1Mi0xMi45NDktNS4yODUyLTQuODQzOCAwLTkuNDkyMiAxLjg5ODQtMTIuOTUzIDUuMjg1MnoiIGZpbGw9IiNmZjg3MmYiLz4KIDwvZz4KPC9zdmc+Cg=="
            style={{ width: "30px", height: "30px" }}
          />
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
          <img
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8cGF0aCBkPSJtNTk4LjU5IDM2NS4xMS00NC40MjItNDIuNjIxLTE1My43Ny0xNDAuNjZjLTYuNjU2Mi02LjEwMTYtMTUuMzU5LTkuNDg4My0yNC4zOTEtOS40ODgzcy0xNy43MyAzLjM4NjctMjQuMzg3IDkuNDg4M2wtMTU0LjUzIDE0Mi4wN2gwLjQ3MjY2bC00NC4xMzcgNDEuMjAzYy0yLjI1NzggMi4xNjAyLTIuOTc2NiA1LjQ3MjctMS44MjAzIDguMzc1IDEuMTUyMyAyLjkwNjIgMy45NTMxIDQuODE2NCA3LjA3ODEgNC44MzU5aDI2Ljc1OHYyMDEuNjFoMTI4LjM5di0xMTcuM2MwLTcuOTc2NiAzLjE2OC0xNS42MjUgOC44MDg2LTIxLjI2NnMxMy4yODktOC44MDg2IDIxLjI2Ni04LjgwODZoNjQuMjE1YzcuOTc2NiAwIDE1LjYyNSAzLjE2OCAyMS4yNjYgOC44MDg2czguODA4NiAxMy4yODkgOC44MDg2IDIxLjI2NnYxMTcuM2gxMjguMzl2LTIwMS42MWgyNi43MTFjMy4xMzI4IDAgNS45NDkyLTEuOTA2MiA3LjExNzItNC44MTI1IDEuMTY4LTIuOTA2MiAwLjQ0OTIyLTYuMjMwNS0xLjgxMjUtOC4zOTg0eiIgZmlsbD0iI2ZmODcyZiIvPgo8L3N2Zz4K"
            style={{ width: "33px", height: "33px" }}
          />
          {/* <PhoneOutlined /> */}
          <StyleText>
            <a href={props.contents.place_url}>{props.contents.place_url}</a>
          </StyleText>
          <br />
          <hr />
          <br />
          {App(props.contents.reivew[0][0])}

          <br />
          {props.contents.reivew.map((item, index) => (
            <li>
              {item[0]}/5점 : {item[1]}
            </li>
          ))}

          <br />
          <p> 후기 더보기 ... </p>
        </div>
      )}
    </Drawer>
  );
}
export function LoadingDetail(props) {
  return (
    <Drawer
      title=""
      placement="right"
      onClose={props.onClose}
      visible={props.visible}
      width={380}
      // className="site-form-in-drawer-wrapper"
    >
      loading
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
const StyleUl = styled.ul``;

export default SearchDetail;
