export class AttendanceIndexUnavailableError extends Error {
  constructor() {
    super("Attendance uniqueness could not be enforced.");
    this.name = "AttendanceIndexUnavailableError";
  }
}

export const isDuplicateAttendanceError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;
