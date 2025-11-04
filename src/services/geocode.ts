import fetch from "node-fetch";

export async function geocodeAddress(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "PropertySMS/1.0 (your@email.com)" },
  });

  if (!res.ok) throw new Error("Geocoding failed");

  const data = (await res.json()) as {
    lat: number;
    lon: number;
    display_name: string;
  }[];

  if (!data.length) return null;

  return {
    lat: String(data[0].lat),
    lon: String(data[0].lon),
    display_name: data[0].display_name,
  };
}
