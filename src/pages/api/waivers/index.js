import fs from "fs";
import glob from "glob";
import multer from "multer";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      glob("./public/files/*", function (er, files) {
        for (const filePath of files) {
          const splits = filePath.split("/");
          const [fileName, extension] = splits[3].split(".");
          if (
            fileName === file.fieldname &&
            "." + extension !== path.extname(file.originalname)
          ) {
            fs.unlinkSync(filePath);
          }
        }
      });
      cb(null, "./public/files/");
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + path.extname(file.originalname));
    },
  }),
  fileFilter: async (req, file, cb) => {
    try {
      const session = await getSession({ req });
      if (session) {
        if (session.user.role !== "admin") {
          throw new Error("You are not permitted to access this endpoint");
        }
      } else {
        throw new Error("Not authenticated");
      }
    } catch (err) {
      return cb(err, false);
    }
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only pdf/doc/docx are allowed"), false);
    }
  },
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.post(
  "/api/waivers/",
  upload.fields([
    { name: "adult", maxCount: 1 },
    { name: "minor", maxCount: 1 },
  ]),
  async (req, res) => {
    res.status(200).json({ message: "successfully added waiver" });
  }
);

apiRoute.get("/api/waivers/", async (req, res) => {
  if (
    typeof req.query.minor === "undefined" ||
    typeof req.query.adult === "undefined"
  ) {
    return res.end("Invalid parameters");
  }
  let minor = req.query.minor.toLowerCase() === "true";
  let adult = req.query.adult.toLowerCase() === "true";
  let result = {};
  let paths = glob.sync("./public/files/*");
  if (adult) {
    for (const filePath of paths) {
      const splits = filePath.split("/");
      const fileName = splits[3].split(".")[0];
      if (fileName === "adult") {
        result.adult = filePath;
      }
    }
    if (!result.adult) result.adult = null;
  }
  if (minor) {
    for (const filePath of paths) {
      const splits = filePath.split("/");
      const fileName = splits[3].split(".")[0];
      if (fileName === "minor") {
        result.minor = filePath;
      }
    }
    if (!result.minor) result.minor = null;
  }
  return res.status(200).json(result);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
