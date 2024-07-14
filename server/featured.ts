import { eq } from "drizzle-orm";
import { db } from "./database/drizzle.ts";
import { featuredServers } from "./database/schema.ts";

export interface Featured {
    name: string;
    domain: string;
}

export async function createFeatured(name: string, domain: string) {
    await db.insert(featuredServers).values({ domain, name });
}

export async function getAllFeatured(): Promise<Featured[]> {
    return await db.select().from(featuredServers).all();
}

export async function removeFeatured(name: string) {
    await db.delete(featuredServers).where(eq(featuredServers.name, name));
}
