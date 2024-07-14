import { getVersionInfo } from "../../../server/version.ts";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
    async GET(req) {
        try {
            const info = await getVersionInfo(req.params.version);
            if (!info) {
                throw new Error("version not found");
            }
            return ok(info);
        } catch (e) {
            return error(String(e));
        }
    },
});
