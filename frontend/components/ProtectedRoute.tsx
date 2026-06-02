import { permissions } from "../lib/permissions";

if (!permissions[user.role].includes(pathname)) {
  router.push("/agenda");
}