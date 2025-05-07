"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ReplyFormProps {
  postId: string;
  className?: string; // Add className to the props interface
}

const ReplyForm = ({ postId, className = "" }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/community/reply", {
        postId,
        content,
      });

      setContent("");
      router.refresh(); // Refresh to see new reply
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex flex-col gap-2 mt-4 ${className}`} // Apply the className here
    >
      <textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded"
        required
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition disabled:bg-green-400"
      >
        {loading ? "Replying..." : "Reply"}
      </button>
    </form>
  );
};

export default ReplyForm;