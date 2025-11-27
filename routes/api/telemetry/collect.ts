import { z } from "zod";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";
import { validateOrThrow } from "../../../helper/validate.ts";
import { backend } from "../../../common.js";

const idSchema = z.object({ playerName: z.string(), sessionId: z.number() });

const modificationsSchema = z.object({
  mods: z.array(
    z.object({
      name: z.string(),
      version: z.string(),
      description: z.string(),
      type: z.string(),
    }),
  ),
  time: z.number(),
});

const modulesSchema = z.record(
  z.object({
    pos: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .optional(),
    enabled: z.boolean(),
  }),
);

const discordSchema = z.object({
  userId: z.string(),
  username: z.string(),
  discriminator: z.string(),
});

const schemaOld = z.object({
  id: idSchema,
  fabric_mod: modificationsSchema.optional(),
  mod: modulesSchema.optional(),
  discord: discordSchema.optional(),
});

interface Telemetry {
  id: z.infer<typeof idSchema>;
  modifications?: z.infer<typeof modificationsSchema>;
  modules?: z.infer<typeof modulesSchema>;
  discord?: z.infer<typeof discordSchema>;
}

export const handler = define.handlers({
  async POST(req) {
    try {
      const telemetryRaw = await req.req.json();
      const telemetry = validateOrThrow(schemaOld, telemetryRaw);

      const res = await fetch(backend.telemetryCollector, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            id: telemetry.id,
            modifications: telemetry.fabric_mod,
            modules: telemetry.mod,
            discord: telemetry.discord,
          } satisfies Telemetry,
        ),
      });

      return ok(await res.json());
    } catch (e) {
      return error(String(e));
    }
  },
});
