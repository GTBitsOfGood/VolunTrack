import { HydratedDocument } from "mongoose";
import { ZodError } from "zod";

// TODO: combine these into one type

export type ApiReturnType<
  DataType,
  DataName extends string,
  Plural extends boolean = false
> =
  | ({
      success: true;
    } & {
      [key in DataName]: Plural extends true
        ? HydratedDocument<DataType>[]
        : HydratedDocument<DataType>;
    })
  | {
      success: false;
      error: ZodError | string;
    };

export type ApiDeleteReturnType = {
  success: true;
} & {
  success: false;
  error: ZodError | string;
};
