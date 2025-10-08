import client from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = await client?.db("aroxj-blog");

    const data = await db?.collection("contents").findOne({
      slug: id,
    });
    return Response.json({ data });
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}
