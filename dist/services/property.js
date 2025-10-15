import fetch from "node-fetch";
export async function getPropertyData(lat, lon) {
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?latitude=${lat}&longitude=${lon}`;
    console.log("Fetching ATTOM property snapshot:", url);
    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY,
            },
        });
        if (!res.ok) {
            const text = await res.text();
            console.error("ATTOM lookup failed:", res.status, text);
            throw new Error(`ATTOM request failed (${res.status})`);
        }
        const json = (await res.json());
        console.log("ATTOM Full Response:", JSON.stringify(json, null, 2));
        const p = json.property?.[0];
        if (!p)
            return null;
        return {
            beds: p.building?.rooms?.beds || "N/A",
            baths: p.building?.rooms?.bathstotal || "N/A",
            sqft: p.building?.size?.universalsize || "N/A",
            lastSaleDate: p.sale?.saledate || "N/A",
            lastSaleAmount: p.sale?.amount?.saleamt || "N/A",
        };
    }
    catch (err) {
        console.error("ATTOM Fetch Error:", err);
        return null;
    }
}
