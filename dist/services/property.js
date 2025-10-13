import fetch from "node-fetch";
export async function getPropertyData(lat, lon) {
    const url = `https://api.developer.attomdata.com/property/v1/nearest?lat=${lat}&lon=${lon}&radius=100`;
    const res = await fetch(url, {
        headers: { "Accept": "application/json", "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY },
    });
    if (!res.ok)
        throw new Error("Property lookup failed");
    const json = (await res.json());
    // Simplify for demo
    const p = json.property?.[0];
    if (!p)
        return null;
    return {
        beds: p.building?.rooms?.beds || "N/A",
        baths: p.building?.rooms?.bathsfull || "N/A",
        sqft: p.building?.size?.livingsize || "N/A",
        lastSaleDate: p.sale?.saledate || "N/A",
        lastSaleAmount: p.sale?.amount?.saleamt || "N/A",
    };
}
