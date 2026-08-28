import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

import Workspace from "@/models/Workspace";

export async function GET(request, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Invite token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      inviteToken: token,
    })
      .populate("owner", "name email avatar")
      .select("name description owner members");

    if (!workspace) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 404 }
      );
    }

    const payload = await getUserFromRequest(request);

    const alreadyMember = payload?.userId
      ? workspace.members.some(
          (member) =>
            member.user?.toString() === payload.userId
        )
      : false;

    return NextResponse.json({
      workspace: {
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        owner: workspace.owner,
        memberCount: workspace.members.length,
      },
      authenticated: Boolean(payload?.userId),
      alreadyMember,
    });
  } catch (error) {
    console.error("INVITE_PREVIEW_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { token } = await params;

    await connectDB();

    const workspace = await Workspace.findOne({
      inviteToken: token,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Invalid or expired invite link" },
        { status: 404 }
      );
    }

    const alreadyMember = workspace.members.some(
      (member) =>
        member.user.toString() === payload.userId
    );

    if (alreadyMember) {
      return NextResponse.json({
        message: "Already a member",
        workspaceId: workspace._id,
        alreadyMember: true,
      });
    }

    workspace.members.push({
      user: payload.userId,
      role: "member",
    });

    await workspace.save();

    return NextResponse.json(
      {
        message: "Joined workspace successfully",
        workspaceId: workspace._id,
        alreadyMember: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("WORKSPACE_JOIN_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}