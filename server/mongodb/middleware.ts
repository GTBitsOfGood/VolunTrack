import {
  DocumentOrQueryMiddleware,
  MongooseDocumentMiddleware,
  MongooseQueryMiddleware,
} from "mongoose";

export const documentMiddleware: MongooseDocumentMiddleware[] = [
  "validate",
  "save",
  "remove",
  "updateOne",
  "deleteOne",
  "init",
];
export const queryMiddleware: MongooseQueryMiddleware[] = [
  "count",
  "estimatedDocumentCount",
  "countDocuments",
  "deleteMany",
  "deleteOne",
  "distinct",
  "find",
  "findOne",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndReplace",
  "findOneAndUpdate",
  "remove",
  "replaceOne",
  "update",
  "updateOne",
  "updateMany",
];
export const documentOrQueryMiddleware: DocumentOrQueryMiddleware[] = [
  "updateOne",
  "deleteOne",
  "remove",
];
