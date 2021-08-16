export interface Address {
  sent: number;
  received: number;
  isContract: boolean;
}

export interface Addresses {
  [key: string]: Address;
}

export interface Errors {
  [key: string]: string;
}

export interface Transaction {
  to: string;
  from: string;
  value: string;
}

export interface RunParams {
  start: number;
  end?: number;
  loading?: Function;
}

export interface ExplorerData {
  start: number;
  end: number;
  current: number;
  totalEth: number;
  contractsCreated: number;
  addresses: Addresses;
  blockErrors: Errors;
  transactionErrors: Errors;
}
