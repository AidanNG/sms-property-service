import fetch from "node-fetch";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
// Zod schemas
const attomSaleSchema = z.object({
    saleTransDate: z.string().optional(),
    amount: z
        .object({
        saleamt: z.number().optional(),
        saledoctype: z.string().optional(),
    })
        .optional(),
});
const attomPropertySchema = z.object({
    identifier: z
        .object({ attomId: z.number().optional() })
        .optional(),
    address: z.object({ oneLine: z.string().optional() }).optional(),
    building: z
        .object({
        size: z.object({ universalsize: z.number().optional() }).optional(),
        rooms: z.object({
            bathstotal: z.number().optional(),
            beds: z.number().optional(),
        }).optional(),
    })
        .optional(),
    summary: z
        .object({
        yearbuilt: z.number().optional(),
        propertyType: z.string().optional(),
    })
        .optional(),
    lot: z.object({ lotSize1: z.number().optional() }).optional(),
    salehistory: z.array(attomSaleSchema).optional(),
});
const attomResponseSchema = z.object({
    property: z.array(attomPropertySchema).optional(),
});
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
        const data = await res.json();
        const parsed = attomResponseSchema.parse(data);
        const property = parsed.property?.[0];
        if (!property)
            return undefined;
        let lastSale;
        //console.log("ATTOM Full Response:", JSON.stringify(data, null, 2));
        //perform second api call to call sales history endpoint
        if (property.identifier?.attomId) {
            const salesUrl = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/snapshot?attomId=${property.identifier.attomId}`;
            const salesRes = await fetch(salesUrl, {
                headers: {
                    Accept: "application/json",
                    "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY,
                },
            });
            if (salesRes.ok) {
                const salesData = await salesRes.json();
                const parsedSales = attomResponseSchema.parse(salesData);
                const saleHistory = parsedSales.property?.[0]?.salehistory || [];
                console.log("ATTOM Full Response:", JSON.stringify(salesData, null, 2));
                // sort by most recent sale
                if (saleHistory.length > 0) {
                    lastSale = saleHistory.sort((a, b) => (b.saleTransDate || "").localeCompare(a.saleTransDate || ""))[0];
                }
            }
            else {
                console.warn("ATTOM sales history API error:", salesRes.statusText);
            }
        }
        return {
            address: property.address?.oneLine || "Address not available",
            bedrooms: property.building?.rooms?.beds,
            bathrooms: property.building?.rooms?.bathstotal,
            squareFeet: property.building?.size?.universalsize,
            yearBuilt: property.summary?.yearbuilt,
            lotSize: property.lot?.lotSize1,
            propertyType: property.summary?.propertyType,
            attomId: property.identifier?.attomId,
            lastSaleDate: lastSale?.saleTransDate,
            lastSaleAmount: lastSale?.amount?.saleamt,
            lastSaleDocType: lastSale?.amount?.saledoctype,
        };
    }
    catch (err) {
        console.error("ATTOM Fetch Error:", err);
        return null;
    }
}
