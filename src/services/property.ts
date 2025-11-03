import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export interface AttomIdentifier {
  Id?: number;
  apn?: string;
  fips?: string;
  attomId?: number;
}

export interface AttomSale {
  saleTransDate?: string;
  amount?:{
    saleamt?: number;
    saledoctype?: string;
  }
}

export interface AttomProperty {
  identifier?: AttomIdentifier;
  lot?: {
    lotSize1?: number;
  };
  address?: {
    oneLine?: string;
  };
  building?: {
    size?: {
      universalsize?: number;
    };
    rooms?: {
      bathstotal?: number;
      beds?: number;
    };
  };
  summary?: {
    yearbuilt?: number;
    propertyType?: string;
  };
  salehistory?: AttomSale[];
}

export interface Property {
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  lotSize?: number;
  propertyType?: string;
  attomId?: number;
  lastSaleDate?: string;
  lastSaleAmount?: number;
  lastSaleDocType?: string;
}
export async function getPropertyData(lat: string, lon: string) {
  const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?latitude=${lat}&longitude=${lon}`;
  console.log("Fetching ATTOM property snapshot:", url);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY!,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ATTOM lookup failed:", res.status, text);
      throw new Error(`ATTOM request failed (${res.status})`);
    }

    const data = (await res.json()) as { property?: AttomProperty[] };
    //console.log("ATTOM Full Response:", JSON.stringify(data, null, 2));

    const property = data?.property?.[0];
    if (!property) return undefined;

    let lastSale: AttomSale | undefined;

  //perform second api call to call sales history endpoint
  if (property.identifier?.attomId) {
    const salesUrl = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/snapshot?attomId=${property.identifier.attomId}`;
    const salesRes = await fetch(salesUrl, {
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": process.env.ATTOM_API_KEY!,
      },
    });
    if (salesRes.ok) {
      const salesData = (await salesRes.json()) as { property?: { salehistory?: AttomSale[] }[] };
      const saleHistory = salesData?.property?.[0]?.salehistory || [];
      console.log("ATTOM Full Response:", JSON.stringify(salesData, null, 2));

      // sort by most recent sale
      if (saleHistory.length > 0) {
        lastSale = saleHistory.sort((a, b) =>
          (b.saleTransDate || "").localeCompare(a.saleTransDate || "")
        )[0];
      }
    } else {
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
 }catch(err){
    console.error("ATTOM Fetch Error:", err);
    return null;
 } 

}
