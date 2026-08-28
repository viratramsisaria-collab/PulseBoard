import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { workspaceSchema } from "@/lib/validations";
import { generateInviteToken } from "@/lib/invite";

import Workspace from "@/models/Workspace";

export async function GET(request) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const workspaces = await Workspace.find({
      "members.user": payload.userId,
    })
      .populate("owner", "name email avatar")
      .populate(
        "members.user",
        "name email avatar status lastSeen"
      )
      .sort({ updatedAt: -1 });

    return NextResponse.json({ workspaces });
  } catch (error) {
    console.error("WORKSPACES_GET_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = workspaceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.create({
      ...result.data,
      owner: payload.userId,
      inviteToken: generateInviteToken(),
      members: [
        {
          user: payload.userId,
          role: "owner",
        },
      ],
    });

    const populatedWorkspace =
      await Workspace.findById(workspace._id)
        .populate("owner", "name email avatar")
        .populate(
          "members.user",
          "name email avatar status lastSeen"
        );

    return NextResponse.json(
      {
        workspace: populatedWorkspace,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("WORKSPACE_CREATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
