import { metaObject } from "@/lib/config/site-seo";
import EventsPage from "@/feature/events";

export const metadata = {
  ...metaObject("Events"),
};
const page = () => {
  return <EventsPage />;
};

export default page;
