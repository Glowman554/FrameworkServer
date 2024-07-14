import { useQuery, useQueryState } from "../client/helper.ts";
import { useIsAdmin, useToken } from "../client/token.ts";
import { Query } from "../components/Query.tsx";
import { trpc } from "../server/trpc/client.ts";
import { Chart } from "$fresh_charts/island.tsx";

export function TelemetryUsageDiagram(props: { token: string }) {
    const q = useQueryState(true);

    const usage = useQuery(
        () => trpc.telemetry.loadUsage.query(props.token),
        q,
    );

    const data = [];
    if (usage) {
        for (const i of usage) {
            data.push({
                label: i.modName,
                data: [i.enabledIn],
            });
        }
    }

    return (
        <Query q={q}>
            <Chart
                type="bar"
                data={{
                    labels: ["enabled in"],
                    datasets: data,
                }}
            >
            </Chart>
        </Query>
    );
}

export function TelemetryInfo(props: { token: string }) {
    const q = useQueryState(true);

    const userCount = useQuery(
        () => trpc.telemetry.loadUserCount.query(props.token),
        q,
    );
    const sessionCount = useQuery(
        () => trpc.telemetry.loadSessionCount.query(props.token),
        q,
    );

    return (
        <Query q={q}>
            <div class="glow-section">
                <p>Users</p>
                <p>{userCount}</p>
            </div>
            <div class="glow-section">
                <p>Sessions</p>
                <p>{sessionCount}</p>
            </div>
        </Query>
    );
}

export function TelemetryView() {
    const q = useQueryState(true);
    const token = useToken(q);
    const isAdmin = useIsAdmin(token, q);

    return (
        <Query q={q}>
            {isAdmin
                ? (
                    <div class="glow-field">
                        <TelemetryUsageDiagram token={token!} />
                        <TelemetryInfo token={token!} />
                    </div>
                )
                : <p>Admin only page</p>}
        </Query>
    );
}
