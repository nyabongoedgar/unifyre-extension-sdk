import {Network} from "ferrum-plumbing";

export interface AddressDetails {
  network: Network;
  currency: string;
  address: string;
  addressWithChecksum?: string;
  humanReadableAddress: string;
  addressType: string;
}

export interface UserAccountGroup {
  id: string;
  addresses: {[key: string]: AddressDetails};
}

export interface UserBalance {
  accountId: string;
  accountType: string;
  address: string;
  addressWithChecksum?: string;
  currency: string;
  balance: string;
  pending: string;
  lastModified: number;
}

export interface AppUserProfile {
  userId: string;
  displayName: string;
  appId: string;
  email?: string;
  accountGroups: UserAccountGroup[];
  balance: UserBalance[];
}