import client from "@/app/lib/mongodb";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitquery = searchParams.get("limit");
  const pagequery = searchParams.get("page");
  const filterquery = searchParams.get("filter");
  let page = 1;
  let limit = 10;
  let filter = -1;

  if (pagequery) {
    page = parseInt(pagequery);
  }

  if (limitquery) {
    limit = parseInt(limitquery);
  }
  if (filterquery) {
    filter = parseInt(filterquery);
  }
  let skipValue = (page - 1) * limit;
  try {
    const db = await client?.db("aroxj-blog");

    const collection = await db?.collection("contents");

    if (collection) {
      const dataCount = await collection.countDocuments();
      if (page > Math.floor(dataCount / limit)) {
        page = Math.floor(dataCount / limit) - 1;
      }
      if (limit * page >= 298 * 20) {

        filter = filter * -1;
        page = Math.floor(dataCount / limit) - page;
        skipValue = (page - 1) * limit;
      }

      const data = await collection
        .aggregate([
          { $sort: { date: filter } },
          { $skip: skipValue },
          { $limit: limit },
        ])
        .toArray();

      return Response.json({ data, pagesCount: Math.ceil(dataCount / limit) });
    }
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}

export async function POST(req: Request) {
  try {
    const db = await client?.db("aroxj-blog");
    const body = await req.json();

    const data = await db?.collection("contents").insertOne({
      ...body,
      created_at: new Date(),
    });

    return Response.json({ data });
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}
