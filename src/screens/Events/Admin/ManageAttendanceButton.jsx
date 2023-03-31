import { useRouter } from "next/router";
import BoGButton from "../../../components/BoGButton";

const ManageAttendanceButton = ({ eventId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`${router.pathname}/${eventId}/attendance`);
  };

  return <BoGButton onClick={handleClick} text="Manage Attendance" />;
};

export default ManageAttendanceButton;
