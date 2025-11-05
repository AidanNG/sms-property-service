import fetch from "node-fetch";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
dotenv.config();
import { attomResponseSchema } from "../types/propertyTypes.js";
export async function getPropertyData(lat, lon) {
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?latitude=${lat}&longitude=${lon}`;
    logger.info(`Fetching ATTOM property snapshot: ${url} `);
    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY,
            },
        });
        if (!res.ok) {
            const text = await res.text();
            logger.error("ATTOM lookup failed:", res.status, text);
            throw new Error(`ATTOM request failed (${res.status})`);
        }
        const data = await res.json();
        const parsed = attomResponseSchema.parse(data);
        const property = parsed.property?.[0];
        if (!property)
            return undefined;
        let lastSale;
        //logger.info("ATTOM Full Response:", JSON.stringify(data, null, 2));
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
                //logger.debug("ATTOM Full Response:", JSON.stringify(salesData, null, 2));
                logger.info(`ATTOM Full Response: ${JSON.stringify(salesData, null, 2)}`);
                // sort by most recent sale
                if (saleHistory.length > 0) {
                    lastSale = saleHistory.sort((a, b) => (b.saleTransDate || "").localeCompare(a.saleTransDate || ""))[0];
                }
            }
            else {
                logger.warn("ATTOM sales history API error:", salesRes.statusText);
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
        logger.error("ATTOM Fetch Error:", err);
        return null;
    }
}
