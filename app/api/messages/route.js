import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { messageSchema } from "@/lib/validations";
import { isValidObjectId } from "@/lib/utils";

import Message from "@/models/Message";
import Workspace from "@/models/Workspace";
import User from "@/models/User";

export async function GET(request) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const workspaceId = searchParams.get("workspace");

    if (!workspaceId || !isValidObjectId(workspaceId)) {
      return NextResponse.json(
        { error: "Valid workspace is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": payload.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    const messages = await Message.find({
      workspace: workspaceId,
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    return NextResponse.json({
      messages,
    });
  } catch (error) {
    console.error("MESSAGES_GET_ERROR:", error);

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

    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { workspace, content } = result.data;

    if (!isValidObjectId(workspace)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspaceDoc = await Workspace.findOne({
      _id: workspace,
      "members.user": payload.userId,
    });

    if (!workspaceDoc) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    const message = await Message.create({
      workspace,
      sender: payload.userId,
      content,
    });

    const populatedMessage = await Message.findById(
      message._id
    ).populate("sender", "name email avatar");

    return NextResponse.json(
      {
        message: populatedMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MESSAGE_CREATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}