import { z } from "zod";
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
