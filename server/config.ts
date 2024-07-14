import { eq } from "drizzle-orm";
import { db } from "./database/drizzle.ts";
import { cloudConfigs } from "./database/schema.ts";

type Config = unknown;

export async function setUserCloudConfig(username: string, config: unknown) {
    const configStr = JSON.stringify(config);

    await db.insert(cloudConfigs).values({
        config: configStr,
        username,
    }).onConflictDoUpdate({
        set: { config: configStr },
        target: cloudConfigs.username,
    });
}

export async function getUserCloudConfig(
    username: string,
): Promise<Config | null> {
    const maybe = await db.select().from(cloudConfigs).where(
        eq(cloudConfigs.username, username),
    );
    if (maybe.length == 0) {
        return null;
    }
    return JSON.parse(maybe[0].config);
}
