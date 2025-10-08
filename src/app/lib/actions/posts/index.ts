import { PostInterface } from "../../schemas";

export async function getPostByID(post_id: string): Promise<PostInterface> {
  const postByID = await fetch(
    `${process.env.NEXT_API_URL}/api/posts/${post_id}`,
    {
      cache: "force-cache",
    }
  );

  const post = await postByID.json();
  return post.data;
}

export async function getTopPost({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
  const postByID = await fetch(
    `${process.env.NEXT_API_URL}/api/posts/top?limit=${limit}&page=${page}`,
    { cache: "force-cache" }
  );

  const post = await postByID.json();
  return post;
}
export async function getArchivePost({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
  const postByID = await fetch(
    `${process.env.NEXT_API_URL}/api/posts/archive?limit=${limit}&page=${page}`,
    { cache: "force-cache" }
  );

  const post = await postByID.json();
  return post;
}
export async function getMostViewedPost({
  limit = 20,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
  const postByID = await fetch(
    `${process.env.NEXT_API_URL}/api/posts/top/views?limit=${limit}&page=${page}`,
    { cache: "force-cache" }
  );

  const post = await postByID.json();
  return post;
}
