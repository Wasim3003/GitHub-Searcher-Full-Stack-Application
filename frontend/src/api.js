import axios from "axios";

export const searchGithub = (type, query) => {
  return axios.post("/api/search/", {
    type,
    query,
  });
};
