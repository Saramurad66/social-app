

import { useContext, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

import { FaTrash, FaSpinner } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { FaSave, FaTimes } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import type { commentType } from "../../Types/Comment.type";
import { AuthContext } from "../../Context/AuthContext";

export default function Comment({
  comment,
  postId,
  querKey,
}: {
  comment: commentType;
  postId: string;
  querKey: string[];
}) {
  const { userId: loginUserId } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { commentCreator, content, image, createdAt, _id } = comment;

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),

    onSuccess: (res) => {
      toast.success(res.data.message || "Comment deleted successfully");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: querKey });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to delete comment",
        );
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),

    onSuccess: (res) => {
      toast.success(res.data.message || "Comment updated successfully");
      setIsEditing(false);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: querKey });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to update comment",
        );
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <div className="border-t border-slate-700 bg-slate-900/70 p-4">
      <div className="flex items-start gap-3">
        <img
          className="h-10 w-10 shrink-0 rounded-full border border-slate-600 object-cover"
          src={commentCreator.photo}
          alt={commentCreator.name}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="inline-block max-w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3">
              <p className="mb-1 text-sm font-semibold text-white">
                {commentCreator.name}
              </p>

              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!editedContent.trim()) {
                      toast.error("Comment cannot be empty");
                      return;
                    }

                    editMutation.mutate();
                  }}
                  className="mt-2 space-y-2"
                >
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2 text-sm text-white outline-none focus:border-blue-500"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1 rounded-lg bg-slate-700 px-2 py-1.5 text-xs text-white"
                    >
                      <FaTimes />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={editMutation.isPending}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1.5 text-xs text-white disabled:opacity-50"
                    >
                      <FaSave />
                      {editMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="break-words text-sm leading-6 text-slate-300">
                  {content}
                </p>
              )}

              {image && (
                <img
                  src={image}
                  alt="Comment attachment"
                  className="mt-2 max-h-60 rounded-lg object-cover"
                />
              )}
            </div>

            {loginUserId === commentCreator._id && (
              <div className="relative shrink-0">
                <HiDotsVertical
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer text-xl text-white hover:text-slate-300"
                />

                {isOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-slate-600 bg-slate-800 p-1.5 shadow-xl">
                    <button
                      onClick={() => {
                        setEditedContent(content);
                        setIsEditing(true);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <FaPenToSquare />
                      <span>Edit</span>
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() => mutate()}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? (
                        <FaSpinner className="animate-spin text-base" />
                      ) : (
                        <FaTrash className="shrink-0 text-base" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="ml-3 mt-2 text-xs text-slate-500">{createdAt}</p>
        </div>
      </div>
    </div>
  );
}
