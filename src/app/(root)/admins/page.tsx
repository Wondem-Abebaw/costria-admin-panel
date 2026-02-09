import { metaObject } from "@/lib/config/site-seo";
import AdminsPage from "@/feature/admins";

export const metadata = {
  ...metaObject("Admins"),
};
const page = () => {
  return <AdminsPage />;
};

export default page;
