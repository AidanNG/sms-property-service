import fetch from "node-fetch";
import { z } from "zod";
const geocodeResultSchema = z.array(z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
}));
export async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
        headers: { "User-Agent": "PropertySMS/1.0 (your@email.com)" },
    });
    if (!res.ok)
        throw new Error("Geocoding failed");
    const data = await res.json();
    const parseResult = geocodeResultSchema.safeParse(data);
    if (!parseResult.success || parseResult.data.length === 0)
        return null;
    const result = parseResult.data[0];
    return {
        lat: result.lat,
        lon: result.lon,
        display_name: result.display_name,
    };
}
