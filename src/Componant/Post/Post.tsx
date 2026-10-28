
import { AiFillLike } from "react-icons/ai";
import { FaComment, FaShare, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import type { postType } from "../../Types/PostType";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import Erorr from "../Erorr/Erorr";
import type { commentType } from "../../Types/Comment.type";
import CommentCreation from "../CommentCreation/CommentCreation";
import { HiDotsVertical } from "react-icons/hi";
import { FaPenToSquare, FaSpinner } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

export default function Post({
  post,
  isPostDetailes = false,
  isProfile = false,
}: {
  post: postType;
  isPostDetailes?: boolean;
  isProfile?: boolean;
}) {
  const {
    body,
    image,
    user,
    createdAt,
    likesCount,
    commentsCount,
    sharesCount,
    topComment,
    _id,
  } = post;

  const { name, photo, _id: userId } = user;
  const { userId: loginUserId } = useContext(AuthContext);
  const query = useQueryClient();
  const querKey = ["getPostComments", _id];
  const [isOpen, setisOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(body);
  const navigate = useNavigate();

  function getPostComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const {
    isPending,
    mutate,
  } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: (res) => {
      toast.success(res.data.message);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getUserProfile"] });

      if (!isProfile) {
        navigate("/");
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete post");
      }
    },
  });

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const editMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${_id}`,
        { body: editedBody },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: (res) => {
      toast.success(res.data.message || "Post updated successfully");
      setIsEditing(false);
      query.invalidateQueries({ queryKey: ["getUserProfile"] });
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to update post");
      }
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: querKey,
    queryFn: getPostComments,
    enabled: isPostDetailes,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Erorr />;
  }

  return (
    <>
      <div className="w-full max-w-[37.5rem] mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-lg my-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between gap-3 items-center p-4">
          <div className="flex gap-4 items-center">
            <img
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-600"
              src={photo}
              alt={name}
            />

            <div>
              <p className="font-semibold text-white">{name}</p>
              <p className="text-xs text-slate-400 mt-1">{createdAt}</p>
            </div>
          </div>

          <div className="relative">
            {loginUserId === userId && (
              <HiDotsVertical
                onClick={() => setisOpen(!isOpen)}
                className="cursor-pointer text-2xl font-bold text-white hover:text-slate-300"
              />
            )}

            {isOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-slate-600 bg-slate-800 p-1.5 shadow-xl">
                <ul className="flex flex-col gap-1">
                  <li>
                    <button
                      onClick={() => {
                        setEditedBody(body);
                        setIsEditing(true);
                        setisOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors duration-200 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <FaPenToSquare className="text-base" />
                      <span>Edit</span>
                    </button>
                  </li>

                  <li>
                    <button
                      disabled={isPending}
                      onClick={() => mutate()}
                      className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? (
                        <FaSpinner className="animate-spin text-base" />
                      ) : (
                        <>
                          <FaTrash className="shrink-0 text-base" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!editedBody.trim()) {
                  toast.error("Post content cannot be empty");
                  return;
                }

                editMutation.mutate();
              }}
              className="mb-4 space-y-3"
            >
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-blue-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm text-white"
                >
                  <FaTimes />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  <FaSave />
                  {editMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-slate-200 leading-6 mb-4">{body}</p>
          )}

          {image && (
            <img
              className="w-full max-h-[28rem] object-cover rounded-xl"
              src={image}
              alt=""
            />
          )}
        </div>

        <div className="border-t border-slate-700 px-4 py-3 flex justify-between gap-2">
          <div className="font-medium text-slate-300 flex gap-2 items-center cursor-pointer hover:text-blue-400 transition-colors">
            <AiFillLike className="text-lg" />
            <span>Likes</span>
            <span className="text-slate-500">({likesCount ?? 0})</span>
          </div>

          <Link to={`/postdetailes/${_id}`}>
            <div className="font-medium text-slate-300 flex gap-2 items-center cursor-pointer hover:text-blue-400 transition-colors">
              <FaComment className="text-lg" />
              <span>Comments</span>
              <span className="text-slate-500">({commentsCount ?? 0})</span>
            </div>
          </Link>

          <div className="font-medium text-slate-300 flex gap-2 items-center cursor-pointer hover:text-blue-400 transition-colors">
            <FaShare className="text-lg" />
            <span>Share</span>
            <span className="text-slate-500">({sharesCount ?? 0})</span>
          </div>
        </div>

        <CommentCreation postId={_id} querKey={querKey} />

        {topComment && (
          <Comment comment={topComment} postId={_id} querKey={querKey} />
        )}

        {isPostDetailes &&
          [...(data?.data.data.comments ?? [])]
            .reverse()
            .map((comment: commentType) => (
              <Comment
                comment={comment}
                postId={_id}
                querKey={querKey}
                key={comment._id}
              />
            ))}
      </div>
    </>
  );
}
