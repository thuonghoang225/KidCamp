import "server-only";
import { isDemoMode } from "@/lib/env";
import { demoRepo } from "./demo";
import { supabaseRepo } from "./supabase";
import type { Repo } from "./types";

export const repo: Repo = isDemoMode ? demoRepo : supabaseRepo;
export type * from "./types";
