import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import Organization from "../../../../../server/mongodb/models/Organization";
import { ObjectId } from "mongodb";

interface QuestionItem {
  id: string;
  value: string;
}

interface RegistrationQuestion {
  id: string;
  title: string;
  type: "multiple" | "dropdown" | "response" | "checkboxes";
  items: QuestionItem[];
  text?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  let { id } = req.query;

  if (Array.isArray(id)) {
    id = id[0];
  }

  if (!id) {
    return res
      .status(400)
      .json({ message: "Missing or invalid organization ID." });
  }

  try {
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    switch (req.method) {
      case "GET": {
        return res
          .status(200)
          .json({ userRegistrationForm: organization.userRegistrationForm });
      }

      case "POST": {
        const { userRegistrationForm } = req.body;

        if (!Array.isArray(userRegistrationForm)) {
          return res.status(400).json({
            error: "Invalid field: userRegistrationForm must be an array",
          });
        }

        for (let i = 0; i < userRegistrationForm.length; i++) {
          const question = userRegistrationForm[i] as RegistrationQuestion;

          if (!question.id || typeof question.id !== "string") {
            return res.status(400).json({
              error: `Invalid question at index ${i}: id is required and must be a string`,
            });
          }

          if (!question.title || typeof question.title !== "string") {
            return res.status(400).json({
              error: `Invalid question at index ${i}: title is required and must be a string`,
            });
          }

          if (
            !question.type ||
            !["multiple", "dropdown", "response", "checkboxes"].includes(
              question.type
            )
          ) {
            return res.status(400).json({
              error: `Invalid question at index ${i}: type must be one of: multiple, dropdown, response, checkboxes`,
            });
          }

          if (!Array.isArray(question.items)) {
            return res.status(400).json({
              error: `Invalid question at index ${i}: items must be an array`,
            });
          }

          for (let j = 0; j < question.items.length; j++) {
            const item = question.items[j] as QuestionItem;
            if (!item.id || typeof item.id !== "string") {
              return res.status(400).json({
                error: `Invalid item at question ${i}, item ${j}: id is required and must be a string`,
              });
            }
            if (!item.value || typeof item.value !== "string") {
              return res.status(400).json({
                error: `Invalid item at question ${i}, item ${j}: value is required and must be a string`,
              });
            }
          }

          if (
            question.text !== undefined &&
            typeof question.text !== "string"
          ) {
            return res.status(400).json({
              error: `Invalid question at index ${i}: text must be a string if provided`,
            });
          }
        }

        await Organization.updateOne(
          { _id: new ObjectId(id) },
          { $set: { userRegistrationForm: userRegistrationForm } }
        );

        return res
          .status(200)
          .json({ message: "Successfully updated userRegistrationForm" });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ message: `Method ${req.method ?? "undefined"} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({
      error: "An Internal Server Error Occurred: " + String(error),
    });
  }
};
