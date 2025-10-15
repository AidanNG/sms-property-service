/**
 * Formats property info into a concise SMS message
 * @param address The display address from geocoding
 * @param property The property object returned from ATTOM
 * @returns A string ready to send via SMS
 */
export function formatPropertyMessage(address, property) {
    return `Property Info for ${address}:

Beds: ${property.beds}
Baths: ${property.baths}
Sqft: ${property.sqft}
Last Sale: ${property.lastSaleAmount} on ${property.lastSaleDate}`;
}
