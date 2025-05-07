import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req:Request,
  { params }: { params: { courseId: string; chapterId: string } }

) {
  try{
      const {userId} = await auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const ownCourse = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId: userId,
        },
      });

      if (!ownCourse) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    const chapter = await db.chapter.findUnique(
      {
        where:{
          id:params.chapterId,
          courseId : params.courseId,
        }
      }
    );
    if (!chapter){
      return new NextResponse("Not Found" , {status:404});
    }

    if (chapter.videoUrl) {  // Fixed typo in videolr[]
      const existingMuxData = await db.muxData.findFirst({
          where: {
              ChapterId: params.chapterId,  // Fixed indentation
          }
      });
  
      if (existingMuxData) {
          await mux.video.assets.delete(existingMuxData.assetId);  // Fixed Video.Assets.del to mux.video.assets.delete
          await db.muxData.delete({
              where: {
                  id: existingMuxData.id,
              }
          });
      }
  }
 const deletedChapter = await db.chapter.delete(
  {
    where:
    {
      id: params.chapterId
    }
  }
 );
 const publishedChaptersInCourse = await db.chapter.findMany({
  where: {
      courseId: params.courseId,
      isPublished: true,
  }
});

if (!publishedChaptersInCourse.length) {
  await db.course.update({
      where: {
          id: params.courseId,
      },
      data: {
          isPublished: false  // Added missing data object
      }
  });
}
return NextResponse.json(deletedChapter);
  } catch (error){
 console.log("[CHAPTER_ID_DELETE]",error);
 return new NextResponse("Internal error", {status:500});
  }
  
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          ChapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // Create new asset with proper typing
      const asset = await mux.video.assets.create({
        input: [{ url: values.videoUrl }], // Array of input objects
        playback_policies: ["public"],
        test: false
      } as any);

      // Get the first playback ID safely
      const playbackId = asset.playback_ids?.[0]?.id;
      if (!playbackId) {
        throw new Error("No playback ID created for the asset");
      }

      // Create new muxData record with required fields
      await db.muxData.create({
        data: {
          ChapterId: params.chapterId,
          assetId: asset.id,
          playbackId: playbackId, // Now guaranteed to be string
        }
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}