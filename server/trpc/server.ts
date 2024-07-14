import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
    createToken,
    createUser,
    getUserByToken,
    passwordOk,
} from "../users.ts";
import superjson from "superjson";
import { createFeatured, getAllFeatured, removeFeatured } from "../featured.ts";

const t = initTRPC.create({ transformer: superjson });

const usernameAndPassword = z.object({
    username: z.string(),
    password: z.string(),
});

export async function adminOnly(token: string) {
    const user = await getUserByToken(token);
    if (!user || !user.admin) {
        throw new Error("Not allowed");
    }
    return user;
}

const users = t.router({
    test: t.procedure.input(z.string()).query(
        async ({ input }) => {
            const user = await getUserByToken(input);
            return user != null;
        },
    ),
    create: t.procedure.input(usernameAndPassword).mutation(
        async ({ input }) => {
            await createUser(input.username, input.password);
            return createToken(input.username);
        },
    ),
    login: t.procedure.input(usernameAndPassword).mutation(
        async ({ input }) => {
            const ok = await passwordOk(input.username, input.password);
            if (!ok) {
                throw new Error("Invalid password");
            }
            return createToken(input.username);
        },
    ),
    isAdmin: t.procedure.input(z.string()).query(async ({ input }) => {
        const user = await getUserByToken(input);
        if (!user) {
            throw new Error("Invalid token");
        }
        return user.admin;
    }),
});

const featured = t.router({
    load: t.procedure.query(async () => {
        return await getAllFeatured();
    }),
    add: t.procedure.input(z.object({
        token: z.string(),
        name: z.string(),
        domain: z.string(),
    })).mutation(async ({ input }) => {
        await adminOnly(input.token);
        await createFeatured(input.name, input.domain);
    }),
    remove: t.procedure.input(z.object({
        token: z.string(),
        name: z.string(),
    })).mutation(async ({ input }) => {
        await adminOnly(input.token);
        await removeFeatured(input.name);
    }),
});

export const appRouter = t.router({
    hello: t.procedure.input(z.string().nullish()).query(async ({ input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return `hello ${input ?? "world"}`;
    }),
    users,
    featured,
});

export type AppRouter = typeof appRouter;
