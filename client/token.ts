import { useEffect, useState } from "preact/hooks";
import { trpc } from "../server/trpc/client.ts";
import { QueryState, useQuery, withQuery } from "./helper.ts";

export function useToken(q: QueryState) {
    const query = useQuery(
        async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const ok = await trpc.users.test.query(token);
                if (ok) {
                    return token;
                }
            }
            return undefined;
        },
        q,
        "token",
    );

    return query;
}

export function useIsAdmin(
    token: string | undefined,
    q: QueryState,
) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            withQuery(
                () => trpc.users.isAdmin.query(token),
                q,
                setIsAdmin,
                "isAdmin",
            );
        }
    }, [token]);

    return isAdmin;
}
