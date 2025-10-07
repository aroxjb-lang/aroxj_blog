import client from "@/app/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitquery = searchParams.get("limit");
  const pagequery = searchParams.get("page");
  let page = 1;
  let limit = 10;

  if (pagequery) {
    page = parseInt(pagequery);
  }

  if (limitquery) {
    limit = parseInt(limitquery);
  }
  let skipValue = (page - 1) * limit;
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  try {
    const db = await client?.db("aroxj-blog");

    const collection = await db?.collection("contents");

    if (collection) {
      const dataCount = await collection.countDocuments({
        date: { $gte: date.toISOString() },
      });

      if (limit * page >= 298 * 20) {
        page = Math.ceil(dataCount / limit) - page;
        skipValue = (page - 1) * limit;
      }

      const data = await collection
        .aggregate([
          {
            $match: { date: { $gte: date.toISOString() } },
          },
          { $sort: { date: -1 } },
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
