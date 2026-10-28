// import axios from "axios";
// import { useEffect, useState } from "react";

// function post() {
//   const [allPosts, setallPosts] = useState([]);
//   const [isLoading, setisLoading] = useState(true);
//   const [isError, setisError] = useState(false);
//   function getAllPosts() {
//     return axios
//       .get(`https://route-posts.routemisr.com/posts?sort=-createdAt`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//         },
//       })
//       .then((res) => {
//         setallPosts(res.data.data.posts);
//       })
//       .catch((err) => {
//         setisError(true);
//       })
//       .finally(() => {
//         setisLoading(false);
//       });
//   }
//   useEffect(()=>{
//     getAllPosts();
//   },[])
//   return{allPosts, isError, isLoading}
// }
