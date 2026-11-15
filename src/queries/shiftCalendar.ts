import axios from "axios";

export type ShiftCalendarShift = {
  eventId: string;
  title: string;
  startTime: string;
  endTime: string;
  maxVolunteers: number;
  filled: number;
  open: number;
  minorsCount: number;
  volunteers: string[];
};

export type ShiftCalendarDay = {
  date: string;
  shifts: ShiftCalendarShift[];
};

export const getShiftCalendar = async (weekStart: string) => {
  try {
    const response = await axios.get<{
      weekStart?: string;
      days?: ShiftCalendarDay[];
      message?: string;
    }>("/api/shift-calendar", { params: { weekStart } });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || error.message,
      };
    }
    return { error: "Error getting shift calendar." };
  }
};
