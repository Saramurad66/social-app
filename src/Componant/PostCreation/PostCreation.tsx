
import { FaImage, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function PostCreation() {
  const [isUplading, setisUplading] = useState("");
  const query = useQueryClient();

  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  function createPost(formdata: FormData) {
    return axios.post(
      "https://route-posts.routemisr.com/posts",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  function clearForm() {
    if (textInput.current && imageInput.current) {
      textInput.current.value = "";
      imageInput.current.value = "";
    }

    setisUplading("");
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createPost,

    onSuccess: (res) => {
      toast.success(res.data.message);
      clearForm();
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to create post"
        );
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  function handleCreatePost() {
    if (!textInput.current || !imageInput.current) return;

    const text = textInput.current.value.trim();
    const file = imageInput.current.files?.[0];

    if (!text && !file) return;

    const formdata = new FormData();

    if (text) {
      formdata.append("body", text);
    }

    if (file) {
      formdata.append("image", file);
    }

    mutate(formdata);
  }

  function handleImagePreviwe(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      setisUplading(URL.createObjectURL(file));
    }
  }

  return (
    <>
      <div className="my-6 mx-auto w-full max-w-[37.5rem] rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-lg">
        <form className="space-y-4">
          <div className="flex items-start gap-3">
            <img
              src="https://placehold.co/100x100"
              alt="User"
              className="h-10 w-10 shrink-0 rounded-full border-2 border-slate-600 object-cover"
            />

            <textarea
              ref={textInput}
              placeholder="What's on your mind?"
              rows={3}
              className="min-w-0 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {isUplading && (
            <div className="relative">
              <img src={isUplading} alt="" />

              <IoIosCloseCircleOutline
                onClick={() => {
                  setisUplading("");

                  if (imageInput.current) {
                    imageInput.current.value = "";
                  }
                }}
                className="absolute top-[10px] end-[10px] size-8 cursor-pointer rounded-2xl bg-white"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-700 pt-3">
            <label
              htmlFor="post-image"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500 hover:bg-slate-700 hover:text-blue-400"
            >
              <FaImage className="text-sm" />
              <span>Add Image</span>

              <input
                ref={imageInput}
                type="file"
                id="post-image"
                accept="image/*"
                className="hidden"
                onChange={handleImagePreviwe}
              />
            </label>

            <button
              disabled={isPending}
              onClick={handleCreatePost}
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
            >
              {isPending ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Create Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
