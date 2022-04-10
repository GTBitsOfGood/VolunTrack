import { unlink } from "fs/promises";

export const deleteWaiver = async (id) => {
  try {
    await unlink(`public/files/${id}.pdf`);
  } catch (e) {
    return { status: 400, message: "Delete file operation failed" };
  }
  return { status: 200, message: "File deleted successfully" };
};
