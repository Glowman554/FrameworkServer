import { getProfile, Profile } from "../../../server/minecraft.ts";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  GET(req) {
    try {
      // deno-lint-ignore require-await
      return withProfile(req.req.headers, async (profile) => {
        return ok({
          username: profile.name,
        });
      });
    } catch (e) {
      return error(String(e));
    }
  },
});

export async function withProfile(
  headers: Headers,
  f: (profile: Profile) => Promise<Response>,
): Promise<Response> {
  const token = headers.get("Authentication");
  if (!token) {
    return error("Missing token");
  }
  const profile = await getProfile(token);
  if (!profile) {
    return error("Invalid token");
  }

  return await f(profile);
}
