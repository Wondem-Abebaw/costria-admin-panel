import { metaObject } from "@/lib/config/site-seo";
import VehiclesPage from "@/feature/vehicle";

export const metadata = {
  ...metaObject("Vehicles"),
};
const page = () => {
  return <VehiclesPage />;
};

export default page;
