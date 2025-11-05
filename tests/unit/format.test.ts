import { formatPropertyMessage } from '../../src/utils/format.js';
import type { Property } from '../../src/types/propertyTypes.js';

describe('formatPropertyMessage', () => {
    test('formats minimal property info', () => {
        const property: Property = {
            address: '123 Main St'
        };
        const result = formatPropertyMessage('Test Location', property);
        expect(result).toBe('Property Info for Test Location\nAddress: 123 Main St');
    });

    test('formats complete property info', () => {
        const property: Property = {
            address: '123 Main St',
            propertyType: 'Single Family',
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 2000,
            lotSize: 5000,
            yearBuilt: 1990,
            attomId: 123456,
            lastSaleDate: '2022-01-01',
            lastSaleAmount: 500000,
            lastSaleDocType: 'Warranty Deed'
        };
        const result = formatPropertyMessage('Test Location', property);
        expect(result).toBe(
            'Property Info for Test Location\n' +
            'Address: 123 Main St\n' +
            'Type: Single Family\n' +
            '3 bd | 2 ba\n' +
            'Size: 2,000 sq ft\n' +
            'Lot: 5,000 sq ft\n' +
            'Built: 1990\n' +
            'ATTOM ID: 123456\n' +
            'Last Sale:\n' +
            'Date: 2022-01-01\n' +
            'Amount: $500,000\n' +
            'Doc Type: Warranty Deed'
        );
    });

    test('handles missing optional fields', () => {
        const property: Property = {
            address: '123 Main St',
            bedrooms: 3
        };
        const result = formatPropertyMessage('Test Location', property);
        expect(result).toBe(
            'Property Info for Test Location\n' +
            'Address: 123 Main St\n' +
            '3 bd | ? ba'
        );
    });

    test('formats partial sale information', () => {
        const property: Property = {
            address: '123 Main St',
            lastSaleAmount: 500000
        };
        const result = formatPropertyMessage('Test Location', property);
        expect(result).toBe(
            'Property Info for Test Location\n' +
            'Address: 123 Main St\n' +
            'Last Sale:\n' +
            'Amount: $500,000'
        );
    });
});