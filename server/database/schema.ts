import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
    username: text("username").primaryKey(),
    passwordHash: text("password_hash").notNull(),
    admin: integer("admin", { mode: "boolean" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
    token: text("token").primaryKey(),
    username: text("username").references(() => users.username, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),
    creationDate: integer("creation_date", { mode: "timestamp" }).default(
        sql`(strftime('%s', 'now'))`,
    ).notNull(),
});

export const featuredServers = sqliteTable("featured_servers", {
    name: text("name").primaryKey(),
    domain: text("domain").notNull(),
});

export const clientInfos = sqliteTable("client_infos", {
    version: text("version").primaryKey(),
    eol: integer("end_of_life", { mode: "boolean" }).notNull(),
});

export const cloudConfigs = sqliteTable("cloud_configs", {
    username: text("username").primaryKey(),
    config: text("config").notNull(),
});

export const telemetryUsers = sqliteTable("telemetry_users", {
    username: text("username").primaryKey(),
});

export const telemetrySessions = sqliteTable("telemetry_sessions", {
    username: text("username").references(() => telemetryUsers.username, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }).notNull(),
    sessionId: integer("session_id").primaryKey(),
    timestamp: integer("timestamp", { mode: "timestamp" }).default(
        sql`(strftime('%s', 'now'))`,
    ).notNull(),
});

export const telemetryMods = sqliteTable("telemetry_mods", {
    sessionId: integer("session_id").references(
        () => telemetrySessions.sessionId,
        { onDelete: "cascade", onUpdate: "cascade" },
    ).notNull(),
    modName: text("mod_name").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.sessionId, table.modName] }),
}));
