import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateInviteToken } from "@/lib/invite";

import Workspace from "@/models/Workspace";

export async function POST(request, { params }) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: id,
      owner: payload.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    workspace.inviteToken = generateInviteToken();

    await workspace.save();

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    return NextResponse.json({
      message: "Invite link generated",
      inviteToken: workspace.inviteToken,
      inviteUrl: `${origin}/join/${workspace.inviteToken}`,
    });
  } catch (error) {
    console.error("INVITE_GENERATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}