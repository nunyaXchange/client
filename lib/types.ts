export type OrderType = "lend" | "borrow";

export interface VTLRange {
  min: number;
  max: number;
}

export interface Order {
  orderType: OrderType;
  amount: number;
  collateral?: number; // Optional, only required for borrow orders
  vtlRange: VTLRange;
  walletAddress: string;
  timestamp: number;
}

export interface OrderFormData {
  orderType: OrderType;
  amount: string;
  collateral: string;
  vtlMin: string;
  vtlMax: string;
}
