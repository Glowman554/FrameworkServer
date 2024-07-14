import { useInput } from "../client/helper.ts";
import { withQuery } from "../client/helper.ts";
import { useQuery, useQueryState } from "../client/helper.ts";
import { useIsAdmin, useToken } from "../client/token.ts";
import { Query } from "../components/Query.tsx";
import { trpc } from "../server/trpc/client.ts";

function VersionAdd(props: { add: (version: string) => void }) {
    const [version, versionChange] = useInput("");

    return (
        <div class="glow-field">
            <div class="glow-section">
                Version
                <input
                    type="text"
                    class="glow-input"
                    onInput={versionChange}
                    value={version}
                />
            </div>
            <div class="glow-center">
                <button
                    class="glow-fancy-button"
                    onClick={() => props.add(version)}
                >
                    Add
                </button>
            </div>
        </div>
    );
}

function VersionList(
    props: {
        remove: (version: string) => void;
        setEol: (version: string, eol: boolean) => void;
    },
) {
    const q = useQueryState(true);
    const list = useQuery(() => trpc.versions.load.query(), q);

    return (
        <Query q={q}>
            <div class="glow-field">
                <table class="glow-table">
                    <tr class="glow-tr">
                        <td class="glow-td">Version</td>
                        <td class="glow-td"></td>
                        <td class="glow-td"></td>
                    </tr>
                    {list
                        ? list.map((entry) => (
                            <tr class="glow-tr">
                                <td class="glow-td">{entry.version}</td>
                                <td class="glow-td">
                                    <button
                                        class="glow-fancy-button"
                                        style={{ margin: 0 }}
                                        onClick={() =>
                                            props.remove(entry.version)}
                                    >
                                        Remove
                                    </button>
                                </td>
                                <td class="glow-td">
                                    <button
                                        class="glow-fancy-button"
                                        style={{ margin: 0 }}
                                        onClick={() =>
                                            props.setEol(
                                                entry.version,
                                                !entry.eol,
                                            )}
                                    >
                                        {entry.eol ? "Unset eol" : "Set eol"}
                                    </button>
                                </td>
                            </tr>
                        ))
                        : <></>}
                </table>
            </div>
        </Query>
    );
}

export function VersionField() {
    const q = useQueryState(true);
    const token = useToken(q);
    const isAdmin = useIsAdmin(token, q);

    return (
        <Query q={q}>
            {isAdmin
                ? (
                    <>
                        <VersionAdd
                            add={(version) =>
                                withQuery(() =>
                                    trpc.versions.add.mutate({
                                        version,
                                        token: token!,
                                    }), q)}
                        />
                        <br />
                        <VersionList
                            remove={(version) =>
                                withQuery(() =>
                                    trpc.versions.remove.mutate({
                                        version,
                                        token: token!,
                                    }), q)}
                            setEol={(version, eol) =>
                                withQuery(() =>
                                    trpc.versions.setEol.mutate({
                                        version,
                                        eol,
                                        token: token!,
                                    }), q)}
                        />
                    </>
                )
                : <p>Admin only page</p>}
        </Query>
    );
}
