import PostForm from "./post-form";
import ReplyForm from "./reply-form";
import prisma from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

export default async function CommunityPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  // Get current user
  const user = await currentUser();

  // Extract all unique user IDs from posts and replies
  const userIds = Array.from(
    new Set([
      ...posts.map(post => post.userId),
      ...posts.flatMap(post => post.replies.map(reply => reply.userId))
    ])
  );

  // Fetch user data from Clerk in a single batch
  const clerkUsers = await fetch(
    `https://api.clerk.com/v1/users?user_ids=${userIds.join(',')}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  ).then(res => res.json());

  // Create a map of user data for easy lookup
  const usersMap = new Map<string, any>();
  clerkUsers.forEach((clerkUser: any) => {
    usersMap.set(clerkUser.id, {
      imageUrl: clerkUser.image_url,
      name: clerkUser.first_name || clerkUser.username || "Anonymous"
    });
  });

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      {user && <PostForm />}

      <div className="mt-8 space-y-6">
        {posts.map((post) => {
          const postUser = usersMap.get(post.userId);
          return (
            <div key={post.id} className="border p-4 rounded shadow">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={postUser?.imageUrl || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium">
                  {postUser?.name || "Anonymous"}
                </span>
              </div>

              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2">{post.content}</p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="mt-4 rounded"
                />
              )}

              <div className="text-sm text-gray-500 mt-2">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </div>

              {/* REPLIES */}
              <div className="mt-4 space-y-3">
                {post.replies.map((reply) => {
                  const replyUser = usersMap.get(reply.userId);
                  return (
                    <div key={reply.id} className="border-t pt-3 pl-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={replyUser?.imageUrl || "/default-avatar.png"}
                          alt="User avatar"
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs font-medium">
                          {replyUser?.name || "Anonymous"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {reply.content}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* REPLY FORM */}
              {user && <ReplyForm postId={post.id} className="mt-3" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}