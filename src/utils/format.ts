import type { Property } from "../types/propertyTypes.js";

export function formatPropertyMessage(locationName: string, property: Property): string {
  const parts: string[] = [];

  parts.push(`Property Info for ${locationName}`);
  if (property.address) parts.push(`Address: ${property.address}`);

  if (property.propertyType)
    parts.push(`Type: ${property.propertyType}`);

  if (property.bedrooms !== undefined || property.bathrooms !== undefined)
    parts.push(
      `${property.bedrooms ?? "?"} bd | ${property.bathrooms ?? "?"} ba`
    );

  if (property.squareFeet)
    parts.push(`Size: ${property.squareFeet.toLocaleString()} sq ft`);

  if (property.lotSize)
    parts.push(`Lot: ${property.lotSize.toLocaleString()} sq ft`);

  if (property.yearBuilt)
    parts.push(`Built: ${property.yearBuilt}`);

  if (property.attomId)
    parts.push(`ATTOM ID: ${property.attomId}`);

  // Include last sale data if available
  if (property.lastSaleDate || property.lastSaleAmount) {
    parts.push("");
    parts.push("Last Sale:");
    if (property.lastSaleDate)
      parts.push(`Date: ${property.lastSaleDate}`);
    if (property.lastSaleAmount)
      parts.push(`Amount: $${property.lastSaleAmount.toLocaleString()}`);
    if (property.lastSaleDocType)
      parts.push(`Doc Type: ${property.lastSaleDocType}`);
  }

  return parts.filter(Boolean).join("\n");
}