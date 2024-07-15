import { ContinueBox } from "./ContinueBox.tsx";
import { useInput } from "../client/helper.ts";
import { withQuery } from "../client/helper.ts";
import { useQuery, useQueryState } from "../client/helper.ts";
import { useIsAdmin, useToken } from "../client/token.ts";
import { Query } from "../components/Query.tsx";
import { Featured } from "../server/featured.ts";
import { trpc } from "../server/trpc/client.ts";
import { useState } from "preact/hooks";

function FeaturedAdd(props: { add: (name: string, domain: string) => void }) {
    const [name, nameChange] = useInput("");
    const [domain, domainChange] = useInput("");

    return (
        <div class="glow-field">
            <div class="glow-section">
                Name
                <input
                    type="text"
                    class="glow-input"
                    onInput={nameChange}
                    value={name}
                />
            </div>
            <div class="glow-section">
                Domain
                <input
                    type="text"
                    class="glow-input"
                    onInput={domainChange}
                    value={domain}
                />
            </div>
            <div class="glow-center">
                <button
                    class="glow-fancy-button"
                    onClick={() => props.add(name, domain)}
                >
                    Add
                </button>
            </div>
        </div>
    );
}

function FeaturedEntry(
    props: { remove: () => void; entry: Featured },
) {
    const [show, setShow] = useState(false);

    return (
        <tr class="tr">
            <td class="glow-td">{props.entry.name}</td>
            <td class="glow-td">{props.entry.domain}</td>
            <td class="glow-td">
                <button
                    class="glow-fancy-button"
                    style={{ margin: 0 }}
                    onClick={setShow.bind(null, true)}
                >
                    Remove
                </button>
                {show
                    ? (
                        <ContinueBox
                            cancelCallback={() => {}}
                            continueCallback={props.remove}
                            resetCallback={setShow.bind(null, false)}
                            message="You are about to delete this!"
                        />
                    )
                    : <></>}
            </td>
        </tr>
    );
}

function FeaturedList(props: { remove: (name: string) => void }) {
    const q = useQueryState(true);
    const list = useQuery(() => trpc.featured.load.query(), q);

    return (
        <Query q={q}>
            <div class="glow-field">
                <table class="glow-table">
                    <thead>
                        <tr class="tr">
                            <td class="glow-td">Name</td>
                            <td class="glow-td">Domain</td>
                            <td class="glow-td"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {list
                            ? list.map((entry) => (
                                <FeaturedEntry
                                    entry={entry}
                                    remove={props.remove.bind(null, entry.name)}
                                />
                            ))
                            : <></>}
                    </tbody>
                </table>
            </div>
        </Query>
    );
}

export function FeaturedField() {
    const q = useQueryState(true);
    const token = useToken(q);
    const isAdmin = useIsAdmin(token, q);

    return (
        <Query q={q}>
            {isAdmin
                ? (
                    <>
                        <FeaturedAdd
                            add={(name, domain) =>
                                withQuery(() =>
                                    trpc.featured.add.mutate({
                                        name,
                                        domain,
                                        token: token!,
                                    }), q)}
                        />
                        <br />
                        <FeaturedList
                            remove={(name) =>
                                withQuery(() =>
                                    trpc.featured.remove.mutate({
                                        name,
                                        token: token!,
                                    }), q)}
                        />
                    </>
                )
                : <p>Admin only page</p>}
        </Query>
    );
}
