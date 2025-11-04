import { z } from "zod";
/*export interface AttomIdentifier {
  Id?: number;
  apn?: string;
  fips?: string;
  attomId?: number;
}

export interface AttomSale {
  saleTransDate?: string;
  amount?: {
    saleamt?: number;
    saledoctype?: string;
  };
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
}*/

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

// Zod schemas
export const attomSaleSchema = z.object({
  saleTransDate: z.string().optional(),
  amount: z
    .object({
      saleamt: z.number().optional(),
      saledoctype: z.string().optional(),
    })
    .optional(),
});

export const attomPropertySchema = z.object({
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

export const attomResponseSchema = z.object({
  property: z.array(attomPropertySchema).optional(),
});