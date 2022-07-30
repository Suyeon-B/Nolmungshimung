import React, { useState } from "react";
import { useQuery } from "react-query";

async function fetchProjectById(_id) {
  const response = await fetch(
    `https://${process.env.REACT_APP_SERVER_IP}:8443/projects/${_id}`
  );
  console.log(response);
  return response.json();
}

const Test = () => {
  const projectId = "62dedc535bb74c8d8efbb050";
  const [temp, setTemp] = useState(null);
  const { data, isError, error, isLoading, isSuccess } = useQuery(
    ["getItems", projectId],
    () => fetchProjectById(projectId),
    {
      suspense: true,
    }
  );
  // if (isSuccess) {
  //   setTemp(data.project_title);
  // }

  console.log(data);
  // setTemp(data.project_title);
  return (
    <>
      <div>{data.project_title}</div>
      <div>{temp}</div>
    </>
  );
};

export default Test;
