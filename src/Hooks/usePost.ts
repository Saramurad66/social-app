import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function usePost() {
  function getAllPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts?sort=-createdAt",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  return useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });
}