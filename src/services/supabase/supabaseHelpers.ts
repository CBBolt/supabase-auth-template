import {
  type QueryFilterType,
  type QueryOperatorType,
} from "../../types/query";

export function supabaseFilter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  filters: QueryFilterType[]
) {
  for (const f of filters) {
    const { column } = f;
    let { operator, value } = f;

    if (!value || !operator) continue;

    let isNegated = false;

    // Handle 'not:' prefix
    if (operator.startsWith("not:")) {
      isNegated = true;
      operator = operator.replace("not:", "") as QueryOperatorType;
    }
    // Normalize value formatting
    switch (operator) {
      case "eq":
      case "neq":
      case "gt":
      case "gte":
      case "lt":
      case "lte":
        query = isNegated
          ? query.not(column, operator, value)
          : query[operator](column, value);
        break;

      case "like":
      case "ilike":
        value = `%${value}%`; // Apply pattern formatting
        query = isNegated
          ? query.not(column, operator, value)
          : query[operator](column, value);
        break;

      //NOTE: From testing not:in value needs to be a string with parenthesis
      // Example: (1, 2, 3)
      case "in":
        if (!Array.isArray(value)) value = [value];
        query = isNegated
          ? query.not(column, "in", value)
          : query.in(column, value);
        break;

      case "is":
        query = isNegated
          ? query.not(column, "is", value)
          : query.is(column, value);
        break;

      case "contains":
        query = isNegated
          ? query.not(column, "cs", value)
          : query.contains(column, value);
        break;

      case "overlaps":
        if (!Array.isArray(value) || value.length === 0) break;
        query = isNegated
          ? query.not(column, "ov", value)
          : query.overlaps(column, value);
        break;

      default:
        console.warn(`Unsupported filter operator: ${operator}`);
    }
  }

  return query;
}
