import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          New Post
        </p>
        <h1 className="text-2xl font-semibold">Create a blog post</h1>
      </div>
      <PostForm />
    </div>
  );
}
