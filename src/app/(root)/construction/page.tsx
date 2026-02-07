import { metaObject } from "@/lib/config/site-seo";

import CommercialPage from "@/feature/commercial-house";
import ConstructionEquipmentPage from "@/feature/construction-equipment";

export const metadata = {
  ...metaObject("Construction Equioments"),
};
const page = () => {
  return <ConstructionEquipmentPage />;
};

export default page;
