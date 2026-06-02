if (!permissions[user.role].includes(pathname)) {
  router.push("/agenda");
}