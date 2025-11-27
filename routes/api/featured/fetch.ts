import { z } from "zod";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";
import { backend } from "../../../common.js";
import { validateOrThrow } from "../../../helper/validate.ts";

const schema = z.array(z.object({
  name: z.string(),
  id: z.number(),
  address: z.string(),
}));

export interface Old {
  name: string;
  address: string;
}

export const handler = define.handlers({
  async GET(_req) {
    try {
      const data = await fetch(backend.featuredServers);
      if (!data.ok) {
        return error(`Failed to fetch featured servers: ${data.statusText}`);
      }

      const infos = validateOrThrow(schema, await data.json());

      const result: Old[] = [];
      for (const info of infos) {
        result.push({
          name: info.name,
          address: info.address,
        });
      }

      return ok(result);
    } catch (e) {
      return error(String(e));
    }
  },
});
