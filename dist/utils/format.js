export function formatPropertyMessage(address, property) {
    return `🏠 ${address.split(",").slice(0, 3).join(", ")}
Beds: ${property.beds} | Baths: ${property.baths}
SqFt: ${property.sqft}
Last Sale: ${property.lastSaleDate} for $${property.lastSaleAmount}`;
}
