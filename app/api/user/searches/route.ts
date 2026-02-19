import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { SavedSearch } from "@/lib/models";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const searches = await SavedSearch.find({ userId: session.user.id }).sort({ createdAt: -1 });

  return NextResponse.json(searches);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { query, name } = await req.json();
  if (!query) {
    return NextResponse.json({ message: "Query is required" }, { status: 400 });
  }

  await connectToDatabase();
  
  // Check duplicates
  const existing = await SavedSearch.findOne({ userId: session.user.id, query });
  if (existing) {
      return NextResponse.json(existing);
  }

  const newSearch = await SavedSearch.create({
    query,
    name: name || query,
    userId: session.user.id,
  });

  return NextResponse.json(newSearch, { status: 201 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const id = searchParams.get("id");

    if (!query && !id) {
        return NextResponse.json({ message: "Query or ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    if (id) {
        await SavedSearch.findOneAndDelete({ _id: id, userId: session.user.id });
    } else {
        await SavedSearch.findOneAndDelete({ query, userId: session.user.id });
    }

    return NextResponse.json({ message: "Deleted successfully" });
}
