import { Cookie, setCookie } from "@std/http/cookie";

export function error(message: string): Response {
  return new Response(JSON.stringify({
    error: message,
  }));
}
// deno-lint-ignore no-explicit-any
export function ok(data: any): Response {
  return new Response(JSON.stringify(data));
}

// deno-lint-ignore no-explicit-any
export function okCookie(data: any, cookie: Cookie): Response {
  const res = new Response(JSON.stringify(data));
  setCookie(res.headers, cookie);
  return res;
}
