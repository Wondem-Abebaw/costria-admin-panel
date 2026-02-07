import { metaObject } from "@/lib/config/site-seo";
import UsersPage from "@/feature/users";

export const metadata = {
  ...metaObject("Users"),
};
const page = () => {
  return <UsersPage />;
};

export default page;
