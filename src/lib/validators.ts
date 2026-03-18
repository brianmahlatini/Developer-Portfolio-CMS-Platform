import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(10),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const projectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(10),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().min(1)).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const analyticsSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().optional(),
});
