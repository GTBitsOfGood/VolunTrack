import { HydratedDocument } from "mongoose";
import { ZodError } from "zod";

export type PostRequestReturnType<T> =
  | { success: true; data: HydratedDocument<T> }
  | { success: false; error: ZodError | string };
