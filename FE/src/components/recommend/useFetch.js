import { useCallback, useEffect, useState } from "react";

function useFetch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [uploadProject, setUploadProject] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  let url = `//${process.env.REACT_APP_SERVER_IP}:8443/recommend/`;
  let urlWithParams = url + `${query}`;

  useEffect(() => {
    setLoading(true);
    setError(false);

    let controller = new AbortController();
    fetch(urlWithParams, {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((res) => {
        setUploadProject((prevProjects) => {
          // console.log(res);
          return [...prevProjects, ...res];
        });
        setHasMore(res.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        setError(true);
      });
    return () => controller.abort(); // 불필요한 request 방지
  }, [query, pageNumber]);
  return { loading, error, uploadProject, hasMore };
}

export default useFetch;
