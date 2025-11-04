export interface AttomIdentifier {
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