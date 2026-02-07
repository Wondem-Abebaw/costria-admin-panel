import { metaObject } from "@/lib/config/site-seo";
import VehiclesPage from "@/feature/vehicle";
import ResidentialPage from "@/feature/residential-house";

export const metadata = {
  ...metaObject("Vehicles"),
};
const page = () => {
  return <ResidentialPage />;
};

export default page;
