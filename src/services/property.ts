import fetch from "node-fetch";
import { z } from "zod";
import { logger } from "../utils/logger.js";

import { env } from "../config/env.js";
import { attomResponseSchema } from "../types/propertyTypes.js";
import { get } from "http";


// --- Public API: by Address ---
export async function getPropertyDataByAddress(address: string[], lat: string, lon: string) {
  try {
    logger.info(`Using address: ${address}`);
    const encode = (str: string) =>
      str.trim().replaceAll(" ", "%20").replaceAll(",", "%2C");

    [address[0], address[1]] = [
      encode(address[0]),
      address.length > 1 ? encode(address.slice(1).join(",")) : address[1],
    ];

    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=${address[0]}${
      address[1] ? `&address2=${address[1]}` : ""
    }`;
    return await getPropertyData(url);
  } catch (err) {
    logger.error(`ATTOM Fetch Error (Address): ${err}, trying Geocode fallback.`);
    return getPropertyDataByGeocode(lat, lon);
  }
}

// --- Public API: by Geocode ---
export async function getPropertyDataByGeocode(lat: string, lon: string) {
  try {
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?latitude=${lat}&longitude=${lon}`;
    return await getPropertyData(url);
  } catch (err) {
    logger.error(`ATTOM Fetch Error (Geocode): ${err}`);
    return null;
  }
}

// --- Core shared logic ---
async function getPropertyData(url: string) {
  const parsed = await fetchAttomData(url);
  const property = parsed.property?.[0];
  if (!property) return undefined;

  const lastSale = await fetchLastSale(property.identifier?.attomId);
  return mapPropertyData(property, lastSale);
}

// --- Helper: ATTOM fetch wrapper ---
async function fetchAttomData(url: string) {
  logger.info(`Fetching ATTOM property data: ${url}`);
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": env.ATTOM_API_KEY!,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    logger.error(`ATTOM lookup failed: ${res.status}, ${text}`);
    throw new Error(`ATTOM request failed (${res.status})`);
  }

  const data = await res.json();
  return attomResponseSchema.parse(data);
}

// --- Helper: Fetch latest sale info ---
async function fetchLastSale(attomId?: number) {
  if (!attomId) return undefined;

  const salesUrl = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/snapshot?attomId=${attomId}`;
  try {
    const salesRes = await fetch(salesUrl, {
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": env.ATTOM_API_KEY!,
      },
    });

    if (!salesRes.ok) {
      logger.warn(`ATTOM sales history API error: ${salesRes.statusText}`);
      return undefined;
    }

    const salesData = await salesRes.json();
    const parsedSales = attomResponseSchema.parse(salesData);
    const saleHistory = parsedSales.property?.[0]?.salehistory || [];

    if (saleHistory.length > 0) {
      return saleHistory.sort((a, b) =>
        (b.saleTransDate || "").localeCompare(a.saleTransDate || "")
      )[0];
    }
  } catch (err) {
    logger.error(`Sales history fetch failed: ${err}`);
  }
  return undefined;
}

// --- Helper: Extract relevant property fields ---
function mapPropertyData(property: any, lastSale?: any) {
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

