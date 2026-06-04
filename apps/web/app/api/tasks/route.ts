import { NextResponse } from "next/server";
import { tasks } from "@servelect/shared";

export async function GET() {
  return NextResponse.json({ data: tasks });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body, message: "Task mock creat. În backend real se va salva în PostgreSQL." }, { status: 201 });
}
