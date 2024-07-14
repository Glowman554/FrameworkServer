import { error, ok } from "../../../server/response.ts";
import {
    processTelemetry,
    TelemetryPacket,
} from "../../../server/telemetry.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
    async POST(req) {
        try {
            const telemetry = await req.req.json() as TelemetryPacket;
            await processTelemetry(telemetry);
            return ok({});
        } catch (e) {
            return error(String(e));
        }
    },
});
