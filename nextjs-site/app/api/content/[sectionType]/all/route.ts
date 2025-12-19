import { NextResponse } from "next/server";
import { getContentBySection } from "@/lib/content";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionType: string }> }
) {
  const { sectionType } = await params;

  if (
    sectionType !== "projects" &&
    sectionType !== "specialities" &&
    sectionType !== "thoughts"
  ) {
    return NextResponse.json(
      { error: "Invalid section type" },
      { status: 400 }
    );
  }

  const items = getContentBySection(
    sectionType as "projects" | "specialities" | "thoughts"
  );

  return NextResponse.json(items);
}
