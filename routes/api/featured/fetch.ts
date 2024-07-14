import { getAllFeatured } from "../../../server/featured.ts";
import { error, ok } from "../../../server/response.ts";
import { define } from "../../../utils.ts";

export interface Result {
    name: string;
    address: string;
}

export const handler = define.handlers({
    async GET(_req) {
        try {
            const result: Result[] = [];

            for (const featured of await getAllFeatured()) {
                result.push({
                    name: featured.name,
                    address: featured.domain,
                });
            }

            return ok(result);
        } catch (e) {
            return error(String(e));
        }
    },
});
