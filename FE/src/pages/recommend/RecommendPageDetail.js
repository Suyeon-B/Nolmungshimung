import { useState, useEffect } from "react";

const RecommendPageDetail = ({ projectId }) => {
  const [projectID, setProjectId] = useState(projectId);

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId]);
  console.log(projectID);
  console.log("여기는 추천 프로젝트 디테일이지롱~~");
};

export default RecommendPageDetail;
