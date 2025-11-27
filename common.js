import "@std/dotenv/load";

export async function common() {
}

export const backend = {
  featuredServers: "https://framework.toxicfox.de/api/v1/featuredServers",
  telemetryCollector: "https://framework.toxicfox.de/api/v1/telemetry",
  versionInfo: "https://framework.toxicfox.de/api/v1/version/{version}",
  testToken: "https://framework.toxicfox.de/api/v1/testToken",
  profileUpload: "https://framework.toxicfox.de/api/v1/config/uploadProfile",
  profileDownload:
    "https://framework.toxicfox.de/api/v1/config/downloadProfile",
  chatPublish: "https://framework.toxicfox.de/api/v1/chat/publish",
  chatSubscribe: "wss://framework.toxicfox.de/api/v1/chat/subscribe",
};
