export interface InvoiceItem {
    name: string;
    price: number;
  }
  
  export interface InvoiceType {
    id: string;
    date: string;
    customerName: string;
    items: InvoiceItem[];
    total: number;
  }
  