import { useEffect } from "react";
import EventManager from "./EventManager";

const EventManagerSelector = () => {
  useEffect(() => {
    const nextRoot = document.getElementById("__next");
    if (nextRoot) {
      nextRoot.style.overflowY = "hidden"; // Disable scroll
    }

    return () => {
      if (nextRoot) {
        nextRoot.style.overflowY = "auto"; // Re-enable on unmount
      }
    };
  }, []);

  return <EventManager isHomePage={false} />;
};

export default EventManagerSelector;
