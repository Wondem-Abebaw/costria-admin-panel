import { metaObject } from "@/lib/config/site-seo";
import VehiclesPage from "@/feature/vehicle";
import ResidentialPage from "@/feature/residential-house";
import CommercialPage from "@/feature/commercial-house";

export const metadata = {
  ...metaObject("Commercial Properties"),
};
const page = () => {
  return <CommercialPage />;
};

export default page;
