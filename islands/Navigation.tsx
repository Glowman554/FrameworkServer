import { useState } from "preact/hooks";

export function Navigation() {
    const [mainBarClass, setMainBarClass] = useState("glow-bar");
    return (
        <div class={mainBarClass}>
            <a href="/">Home</a>
            <a href="/account/login">Login</a>
            <a href="/account/create">Register</a>
            <a href="/telemetry">Telemetry</a>
            <a href="/versions">Versions</a>
            <a href="/featured">Featured servers</a>

            <a
                href="javascript:void(0);"
                onClick={() => {
                    if (mainBarClass == "glow-bar") {
                        setMainBarClass("glow-bar responsive");
                    } else {
                        setMainBarClass("glow-bar");
                    }
                }}
                class="icon"
            >
                <img src="/menu.svg" alt="Menu" style="width: 2rem;" />
            </a>
        </div>
    );
}
