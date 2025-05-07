import {
    generateUploadButton,
    generateUploadDropzone,
    generateUploader,
  } from "@uploadthing/react";
  
  import type { OurFileRouter } from "@/app/api/uploadthing/core";
  
  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  export const Uploader = generateUploader<OurFileRouter>();
  
  import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  postImage: f({ image: { maxFileSize: "4MB" } }) // 4MB images for posts
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for post:", file.url);
    }),
};
