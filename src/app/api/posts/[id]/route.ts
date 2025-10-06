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
    console.log(encodeURIComponent(id) + "    NEW ID");
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      let data = await db?.collection("contents").findOne({
        slug: id,
      });
      return Response.json({ data });
    } else {
      let data = await db
        ?.collection("contents")
        .findOne({ _id: new ObjectId(id) });

      return Response.json({ data });
    }
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}
