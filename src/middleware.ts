// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",   // protect dashboard and its subroutes
    "/api/transactions/:path*", // protect transactions API
  ],
};
