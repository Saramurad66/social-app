import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCommentAlt, FaImage } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";

type CommentFormValues = {
  content: string;
  image: FileList | null;
};

export default function CommentCreation({
  postId,
  querKey,
}: {
  postId: string;
  querKey: string[];
}) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
      image: null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: (res) => {
      toast.success(res.data.message || "Comment added successfully");

      queryClient.invalidateQueries({ queryKey: querKey });
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });

      reset();
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to add comment");
        console.log("Comment error:", err.response?.data);
      }
    },
  });

  function handleCreateComment(values: CommentFormValues) {
    if (!values.content.trim() && !values.image?.length) return;

    const formData = new FormData();

    if (values.content.trim()) {
      formData.append("content", values.content.trim());
    }

    if (values.image?.length) {
      formData.append("image", values.image[0]);
    }

    mutate(formData);
  }

  return (
    <div className="my-4 rounded-b-xl border-t border-slate-700 bg-slate-900/70 p-4">
      <form
        className="mx-auto max-w-2xl"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <div className="relative">
          <input
            type="text"
            id="comment"
            autoComplete="off"
            placeholder="Write a comment..."
            className="block w-full rounded-full border border-slate-700 bg-slate-800 py-3 pl-4 pr-14 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            {...register("content")}
          />

          <button
            type="submit"
            disabled={isPending}
            aria-label="Add comment"
            className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <ImSpinner11 className="animate-spin" />
            ) : (
              <FaCommentAlt />
            )}
          </button>
        </div>

        <label
          htmlFor="comment-image"
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-blue-400"
        >
          <FaImage className="text-lg" />
          <span>Upload image</span>
          <input
            type="file"
            id="comment-image"
            accept="image/*"
            hidden
            {...register("image")}
          />
        </label>
      </form>
    </div>
  );
}
