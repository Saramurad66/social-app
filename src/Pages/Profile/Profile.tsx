import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import type { UserType } from "../../Types/ProfileUser.type";
import type { postType } from "../../Types/PostType";
import Post from "../../Componant/Post/Post";
import PostCreation from "../../Componant/PostCreation/PostCreation";
import Erorr from "../../Componant/Erorr/Erorr";
import Loader from "../../Componant/Loader/Loader";

export default function Profile() {
  function getMyProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError} = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });
  const user: UserType = data?.data.data.user;
  // console.log(user);
  function getMyPosts() {
    return axios.get(
      `https://route-posts.routemisr.com/users/${user._id}/posts`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const {
    data: postUserData,
    isLoading: loadingPostUser,
    isError: isErrorPostUser,
   
  } = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: getMyPosts,
    enabled: !isLoading && !isError && !!user,
  });

  if (isLoading) {
  return <Loader />;
}

if (isError) {
  return <Erorr />;
}
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <div className="mx-auto w-full max-w-[37.5rem] px-4">
        

        <div className="my-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-lg">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-slate-700 via-blue-950 to-slate-600">
            {user?.cover && (
              <img
                src={user.cover}
                className="h-full w-full object-cover"
                alt="Cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-5 pb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <img
                src={user?.photo}
                className="-mt-10 h-20 w-20 rounded-full border-4 border-slate-800 bg-slate-700 object-cover shadow-lg"
                alt={user?.name}
              />

              <div className="min-w-0 flex-1 pb-1">
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                <p className="text-sm text-slate-400">@{user?.username}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="break-words text-sm font-medium text-slate-100">
                  {user?.email}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Gender
                </p>
                <p className="text-sm font-medium capitalize text-slate-100">
                  {user?.gender}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Birthday
                </p>
                <p className="text-sm font-medium text-slate-100">
                  {user?.dateOfBirth?.split("T")[0]}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Member Since
                </p>
                <p className="text-sm font-medium text-slate-100">
                  {user?.createdAt?.split("T")[0]}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-700/60 p-3 text-center">
                <p className="text-lg font-bold text-white">
                  {user?.followersCount ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-400">Followers</p>
              </div>

              <div className="rounded-xl bg-slate-700/60 p-3 text-center">
                <p className="text-lg font-bold text-white">
                  {user?.followingCount ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-400">Following</p>
              </div>

              <div className="rounded-xl bg-slate-700/60 p-3 text-center">
                <p className="text-lg font-bold text-white">
                  {user?.bookmarksCount ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-400">Bookmarks</p>
              </div>
            </div>
          </div>
        </div>
<PostCreation />
       
       
        {loadingPostUser ? (
          <Loader />
        ) : isErrorPostUser ? (
          <div className="mx-auto my-6 max-w-[37.5rem] rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center">
            <p className="font-semibold text-red-400">Failed to load posts</p>
            <p className="mt-2 text-sm text-slate-400">
              Check your internet connection and try again.
            </p>
          </div>
        ) : postUserData?.data.data.posts?.length ? (
          postUserData.data.data.posts.map((currentPost: postType) => (
            <Post key={currentPost._id} post={currentPost} isProfile={true}/>
          ))
        ) : (
          <div className="mx-auto my-6 max-w-[37.5rem] rounded-2xl border border-slate-700 bg-slate-800 p-8 text-center">
            <p className="text-lg font-semibold text-white">No posts yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Your posts will appear here.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
