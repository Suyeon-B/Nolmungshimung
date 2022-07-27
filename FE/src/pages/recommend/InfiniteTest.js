import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeFilled, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import useFetch from "../../components/recommend/useFetch";

const { Option } = Select;
import styled from "styled-components";

export default function RecommendPage() {
  // infinite refactoring
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, uploadProject, hasMore } = useFetch(query, pageNumber);
  const observer = useRef();
  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const infinite = (num) => {
    setPageNumber(num);
    setQuery(`infinite?skip=${pageNumber}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNum(1);
  };

  // console.log(uploadProject);
  return (
    <>
      <input type="text" onChange={handleChange} value={query} />
      {uploadProject[0].map((item, i) => {
        const isLastElement = uploadProject[0].length === i + 1;
        isLastElement ? (
          <div key={i} ref={lastElement}>
            {project}
          </div>
        ) : (
          <div key={i}>{project}</div>
        );
      })}
      {/* {uploadProject[0].map((project, index) => {
        if (uploadProject[0].length === index + 1) {
          <div ref={lastElement} key={project}>
            {project.project_title}
          </div>;
        } else {
          <div key={project}>{project.project_title}</div>;
        }
        return;
      })} */}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}
