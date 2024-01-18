export interface CardType {
  _id?: string;
  label?: string;
  productCode?: string;
  cardTypeTransactions: CardTypeTransactions[];
  profiles: CardProfile[];
  desc?: string;
  enabled?: boolean;
  created_at?: number;
}

export interface CardTransactionsType {
  _id?: string;
  label?: string;
  enabled?: boolean;
  created_at?: number;
}

export interface CardTypeTransactions extends CardTransactionsType {
  maxAmountPerDay?: number;
  frequency?: 'week' | 'month';
  maxTransactionsPerDay?: number;
}

export interface CardProfile {
  code?: string;
  label?: string;
  percentage?: number;
  maxTransactionsPerDay?: number;
  amount?: number
}
