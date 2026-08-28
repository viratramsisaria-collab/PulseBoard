import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "workspace_created",
        "member_joined",
        "member_left",
        "task_created",
        "task_updated",
        "task_moved",
        "task_deleted",
        "message_sent",
      ],
    },

    target: {
      type: String,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ActivitySchema.index({
  workspace: 1,
  createdAt: -1,
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);