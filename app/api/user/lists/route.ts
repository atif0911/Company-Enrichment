import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { List } from "@/lib/models";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const lists = await List.find({ userId: session.user.id }).sort({ createdAt: -1 });

  return NextResponse.json(lists);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  await connectToDatabase();
  const newList = await List.create({
    name,
    userId: session.user.id,
    companyIds: [],
  });

  return NextResponse.json(newList, { status: 201 });
}

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    await List.findOneAndDelete({ _id: id, userId: session.user.id });

    return NextResponse.json({ message: "Deleted successfully" });
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, companyIds } = await req.json();

    if (!id || !companyIds) {
        return NextResponse.json({ message: "ID and companyIds are required" }, { status: 400 });
    }

    await connectToDatabase();
    const updatedList = await List.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        { companyIds },
        { new: true }
    );

    return NextResponse.json(updatedList);
}
