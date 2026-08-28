import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(50),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(80),

  description: z
    .string()
    .max(500)
    .optional()
    .default(""),
});

export const taskSchema = z.object({
  workspace: z.string(),

  title: z
    .string()
    .min(1)
    .max(150),

  description: z
    .string()
    .max(1000)
    .optional()
    .default(""),

  status: z
    .enum(["todo", "doing", "done"])
    .optional()
    .default("todo"),

  priority: z
    .enum(["low", "medium", "high"])
    .optional()
    .default("medium"),

  assignee: z
    .string()
    .nullable()
    .optional()
    .default(null),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(150).optional(),

  description: z.string().max(1000).optional(),

  status: z
    .enum(["todo", "doing", "done"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  assignee: z
    .string()
    .nullable()
    .optional(),

  position: z
    .number()
    .optional(),
});

export const messageSchema = z.object({
  workspace: z.string(),

  content: z
    .string()
    .min(1)
    .max(2000),
});