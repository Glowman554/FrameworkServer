import { and, count, eq } from "drizzle-orm";
import { db } from "./database/drizzle.ts";
import {
    telemetryMods,
    telemetrySessions,
    telemetryUsers,
} from "./database/schema.ts";

export interface Usage {
    modName: string;
    enabledIn: number;
}

export interface Mod {
    [key: string]: { enabled: boolean };
}

export interface TelemetryPacket {
    id: {
        playerName: string;
        sessionId: number;
    };
    mod?: Mod;
}

export interface Session {
    username: string;
    sessionId: number;
    timestamp: Date;
}

export async function getSession(
    playerName: string,
    sessionId: number,
): Promise<Session | null> {
    const maybe = await db.select().from(telemetrySessions).where(
        and(
            eq(telemetrySessions.username, playerName),
            eq(telemetrySessions.sessionId, sessionId),
        ),
    );
    if (maybe.length == 0) {
        return null;
    }
    return maybe[0];
}

// Ziemlich gottlos aber es funktioniert.
// NICHT ANFASSEN!
export async function processTelemetry(packet: TelemetryPacket) {
    console.log(packet.id);

    await db.insert(telemetryUsers).values({ username: packet.id.playerName })
        .onConflictDoNothing();
    await db.insert(telemetrySessions).values({
        username: packet.id.playerName,
        sessionId: packet.id.sessionId,
    }).onConflictDoNothing();

    if (packet.mod) {
        for (const mod in packet.mod) {
            await db.insert(telemetryMods).values({
                sessionId: packet.id.sessionId,
                modName: mod,
                enabled: packet.mod[mod].enabled,
            }).onConflictDoUpdate({
                set: { enabled: packet.mod[mod].enabled },
                target: [telemetryMods.sessionId, telemetryMods.modName],
            });
        }
    }
}

export async function getUserCount() {
    const result = await db.select({ count: count() }).from(telemetryUsers);
    return result[0].count;
}

export async function getUsage(): Promise<Usage[]> {
    const result = await db.select({
        modName: telemetryMods.modName,
        enabledIn: count(),
    }).from(telemetryMods)
        .where(eq(telemetryMods.enabled, true))
        .groupBy(telemetryMods.modName);
    return result;
}

export async function getSessionCount() {
    const result = await db.select({ count: count() }).from(telemetrySessions);
    return result[0].count;
}
