import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";
import { backend } from "../../../common.js";

export const handler = define.handlers({
  async GET(req) {
    try {
      const token = req.req.headers.get("Authentication");
      if (!token) {
        return error("Missing token");
      }

      const res = await fetch(backend.profileDownload, {
        method: "POST",
        headers: {
          "Authentication": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "_legacy",
        }),
      });

      if (!res.ok) {
        return error(`Failed to fetch config: ${res.statusText}`);
      }

      const config = await res.json();
      return ok(config);
    } catch (e) {
      return error(String(e));
    }
  },
  async POST(req) {
    try {
      const token = req.req.headers.get("Authentication");
      if (!token) {
        return error("Missing token");
      }

      const configuration = await req.req.json();

      const res = await fetch(backend.profileUpload, {
        method: "POST",
        headers: {
          "Authentication": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "_legacy",
          configuration,
        }),
      });

      return ok(await res.json());
    } catch (e) {
      return error(String(e));
    }
  },
});
