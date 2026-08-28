import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { workspaceSchema } from "@/lib/validations";
import { isValidObjectId } from "@/lib/utils";

import Workspace from "@/models/Workspace";

export async function GET(request, { params }) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: id,
      "members.user": payload.userId,
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar status");

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    console.error("WORKSPACE_GET_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
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

    workspace.name = result.data.name;
    workspace.description = result.data.description;

    await workspace.save();

    return NextResponse.json({
      workspace,
    });
  } catch (error) {
    console.error("WORKSPACE_UPDATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOneAndDelete({
      _id: id,
      owner: payload.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    console.error("WORKSPACE_DELETE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}