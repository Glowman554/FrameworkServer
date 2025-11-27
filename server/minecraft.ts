interface Skin {
  id: string;
  state: string;
  url: string;
  textureKey: string;
  variant: string;
}

interface Cape {
  id: string;
  state: string;
  url: string;
  alias: string;
}

export interface Profile {
  id: string;
  name: string;
  skins: Skin[];
  capes: Cape[];
}

export async function getProfile(token: string): Promise<Profile | null> {
  const res = await fetch(
    "https://api.minecraftservices.com/minecraft/profile",
    {
      headers: {
        "Authorization": "Bearer " + token,
      },
    },
  );

  if (res.status != 200) {
    console.log(await res.json(), res.status);
    return null;
  }

  const json = await res.json() as Profile;
  return json;
}
