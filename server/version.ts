import { eq } from "drizzle-orm";
import { db } from "./database/drizzle.ts";
import { clientInfos } from "./database/schema.ts";

export interface VersionInfo {
    version: string;
    eol: boolean;
}

export async function createVersionInfo(version: string) {
    await db.insert(clientInfos).values({ version, eol: false });
}

export async function setEol(version: string, eol: boolean) {
    await db.update(clientInfos).set({ eol }).where(
        eq(clientInfos.version, version),
    );
}

export async function getVersionInfo(
    version: string,
): Promise<VersionInfo | null> {
    const maybe = await db.select().from(clientInfos).where(
        eq(clientInfos.version, version),
    );
    if (maybe.length == 0) {
        return null;
    }
    return maybe[0];
}

export async function getAllVersionInfos(): Promise<VersionInfo[]> {
    return await db.select().from(clientInfos).all();
}

export async function removeVersionInfo(version: string) {
    await db.delete(clientInfos).where(eq(clientInfos.version, version));
}