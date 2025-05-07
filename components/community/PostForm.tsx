"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload"; // you already have it!
import toast from "react-hot-toast";

export function PostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/api/community/post", {
        title,
        content,
        imageUrl,
      });
      toast.success("Post created!");
      setTitle("");
      setContent("");
      setImageUrl("");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        placeholder="Post content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <FileUpload
        endpoint="postImage"
        onChange={(url) => {
          if (url) {
            setImageUrl(url);
          }
        }}
      />
      <Button onClick={handleSubmit}>Create Post</Button>
    </div>
  );
}
