import { useQuery } from '@tanstack/react-query';
import axios from 'axios'

import Loader from '../../Componant/Loader/Loader';
import Erorr from '../../Componant/Erorr/Erorr';
import { useParams } from 'react-router';
import Post from '../../Componant/Post/Post';

export default function PostDetailes() {
    // post detailes
    // get post id
  const {id} =  useParams()
    function getPostDetailes(){
        return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
            headers :{
                Authorization :`Bearer ${localStorage.getItem("userToken")}`
            }
        })
    }
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getSinglePosts", id],
        queryFn: getPostDetailes,
      });
      if (isLoading) {
        return <Loader />;
      }
      if (isError) {
        return <Erorr />;
      }
  return (
    <>
    <Post post={data?.data.data.post} isPostDetailes={true}/>
    </>
  )
}
