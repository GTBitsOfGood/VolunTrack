import EventManager from "./EventManager";

// The page scrolls like every other page. It used to switch scrolling off for
// the whole site, which cut off the shift week box and the event list.
const EventManagerSelector = () => <EventManager isHomePage={false} />;

export default EventManagerSelector;
