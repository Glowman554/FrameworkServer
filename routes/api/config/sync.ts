import {
    getUserCloudConfig,
    setUserCloudConfig,
} from "../../../server/config.ts";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";
import { withProfile } from "./test.ts";

export const handler = define.handlers({
    GET(req) {
        try {
            return withProfile(req.req.headers, async (profile) => {
                const config = await getUserCloudConfig(profile.name);
                if (!config) {
                    throw new Error("No config found");
                }
                return ok(config);
            });
        } catch (e) {
            return error(String(e));
        }
    },
    POST(req) {
        try {
            return withProfile(req.req.headers, async (profile) => {
                const config = await req.req.json();
                setUserCloudConfig(profile.name, config);
                return ok({});
            });
        } catch (e) {
            return error(String(e));
        }
    },
});
