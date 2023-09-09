export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type FeatureFlag = {
  id: number;
  name: string;
  enabled: boolean;
  type: 'BOOLEAN' | 'MULTI';
  content: string;
  value: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
};

export type Token = {
  id: number;
  token: string;
  user: string;
  createdAt: Date;
  valid: boolean;
  validUntil: Date;
};
