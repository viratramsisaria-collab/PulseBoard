import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import {
  taskSchema,
  taskUpdateSchema,
} from "@/lib/validations";
import { isValidObjectId } from "@/lib/utils";

import Task from "@/models/Task";
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

    const tasks = await Task.find({
      workspace: workspaceId,
    })
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ position: 1, createdAt: 1 });

    return NextResponse.json({
      tasks,
    });
  } catch (error) {
    console.error("TASKS_GET_ERROR:", error);

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

    const result = taskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    if (!isValidObjectId(data.workspace)) {
      return NextResponse.json(
        { error: "Invalid workspace ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findOne({
      _id: data.workspace,
      "members.user": payload.userId,
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or unauthorized" },
        { status: 404 }
      );
    }

    const lastTask = await Task.findOne({
      workspace: data.workspace,
      status: data.status,
    }).sort({ position: -1 });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
      ...data,
      createdBy: payload.userId,
      position,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar");

    return NextResponse.json(
      {
        task: populatedTask,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("TASK_CREATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { id, workspace, ...updates } = body;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Valid task ID is required" },
        { status: 400 }
      );
    }

    if (!workspace || !isValidObjectId(workspace)) {
      return NextResponse.json(
        { error: "Valid workspace ID is required" },
        { status: 400 }
      );
    }

    const result = taskUpdateSchema.safeParse(updates);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0].message,
        },
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

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        workspace,
      },
      result.data,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar");

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      task,
    });
  } catch (error) {
    console.error("TASK_UPDATE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const payload = await getUserFromRequest(request);

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    const workspace = searchParams.get("workspace");

    if (
      !id ||
      !workspace ||
      !isValidObjectId(id) ||
      !isValidObjectId(workspace)
    ) {
      return NextResponse.json(
        { error: "Valid task and workspace IDs are required" },
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

    const task = await Task.findOneAndDelete({
      _id: id,
      workspace,
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("TASK_DELETE_ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}