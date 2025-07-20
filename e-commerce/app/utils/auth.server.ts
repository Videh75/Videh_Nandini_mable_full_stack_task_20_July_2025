import { redirect } from "@remix-run/node";
export async function isAuthenticated(request: Request): Promise<boolean> {
 const cookieHeader = request.headers.get("Cookie");
 const authCookieName = "Authorization";


 if (cookieHeader && cookieHeader.includes(`${authCookieName}=`)) {
   console.log("Authentication cookie found!");
   return true;
 }


 console.log("Authentication cookie NOT found.");
 return false;
}


export async function requireAuth(request: Request): Promise<void> {
 const userIsLoggedIn = await isAuthenticated(request);


 if (!userIsLoggedIn) {
   const url = new URL(request.url);
   const returnTo = url.pathname + url.search;
   throw redirect(`/login`);
 }
}
