import { backend } from "../../../common.js";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";
import { z } from "zod";
import { validateOrThrow } from "../../../helper/validate.ts";

const schema = z.object({
  version: z.string(),
  endOfLife: z.boolean(),
  downloadUrl: z.string().url(),
});

interface Old {
  version: string;
  eol: boolean;
}

export const handler = define.handlers({
  async GET(req) {
    try {
      const data = await fetch(
        backend.versionInfo.replace("{version}", req.params.version),
      );
      if (!data.ok) {
        return error(`Failed to fetch version info: ${data.statusText}`);
      }

      const info = validateOrThrow(schema, await data.json());

      return ok(
        {
          version: info.version,
          eol: info.endOfLife,
        } satisfies Old,
      );
    } catch (e) {
      return error(String(e));
    }
  },
});
