export type QueryType = {
  method: QueryMethodType;
  datasource: string;
  columns: string | string[];
  filters?: QueryFilterType[];
  data?: Record<string, unknown> | Record<string, unknown>[];
  order?: string;
  addlKeywords?: Record<QueryAddlKeywordsType, unknown>;
};

type QueryAddlKeywordsType = "SINGLE";
type QueryMethodType = "SELECT" | "UPDATE" | "UPSERT" | "INSERT" | "DELETE";

export const operatorTypes = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "like",
  "ilike",
  "in",
  "is",
  "contains",
  "overlaps",
] as const;
type BaseOperatorType = (typeof operatorTypes)[number];
export type QueryOperatorType = BaseOperatorType | `not:${BaseOperatorType}`;

export type QueryFilterType = {
  column: string;
  operator: QueryOperatorType;
  value: unknown;
};
