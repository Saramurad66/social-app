import type { postType } from "../../Types/PostType";
import Post from "../../Componant/Post/Post";
import Loader from "../../Componant/Loader/Loader";
import Erorr from "../../Componant/Erorr/Erorr";
import PostCreation from "../../Componant/PostCreation/PostCreation";
import { Helmet } from "react-helmet-async";
import UsePost from "../../Hooks/usePost";


export default function Newsfeed() {
  //call all posts
  const { data, isLoading, isError, error } = UsePost();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.log(error);
    return <Erorr />;
  }

  const posts = data?.data?.data?.posts;

  return (
    <>
      <Helmet>
        <title>Newsfeed</title>
      </Helmet>

      <div className="my-8">
        <div className="w-full max-w-[600px] mx-auto">
          <PostCreation />
        </div>

        {posts?.map((post: postType) => (
          <Post
            post={post}
            key={post.id}
            isPostDetailes={false}
          />
        ))}
      </div>
    </>
  );
}