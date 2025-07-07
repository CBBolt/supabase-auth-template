import { getSupabaseClient } from "../services/supabase/supabaseClient";
import { supabaseFilter } from "../services/supabase/supabaseHelpers";
import { type QueryType } from "../types/query";

export async function fetchDBData<T, IsArray extends boolean = true>(
  query: QueryType
): Promise<{
  data: IsArray extends true ? T[] : T | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();
  const table = supabase.from(query.datasource);
  const columns = Array.isArray(query.columns)
    ? Array.from(query.columns).join(", ")
    : query.columns;

  let dataQuery;

  if (!query.method) throw new Error("Method not found");

  switch (query.method) {
    case "SELECT":
      dataQuery = table.select(columns);
      break;

    case "INSERT":
      if (!query.data) throw new Error("INSERT requires data");
      dataQuery = table.insert(query.data as Record<string, unknown>[]);
      if (query.columns) {
        dataQuery = dataQuery.select(columns); // Optional, return inserted rows
      }
      break;

    case "UPDATE":
      if (!query.data) throw new Error("UPDATE requires data");
      dataQuery = table.update(query.data as Record<string, unknown>);
      if (query.columns) {
        dataQuery = dataQuery.select(columns); // Optional, return updated rows
      }
      break;

    case "UPSERT":
      if (!query.data) throw new Error("UPDATE requires data");
      dataQuery = table.upsert(query.data as Record<string, unknown>[]);
      if (query.columns) {
        dataQuery = dataQuery.select(columns); // Optional, return updated rows
      }
      break;

    case "DELETE":
      dataQuery = table.delete();
      if (query.columns) {
        dataQuery = dataQuery.select(columns); // Optional, return deleted rows
      }
      break;

    default:
      throw new Error(`Unsupported method: ${query.method}`);
  }

  if (query.filters) {
    dataQuery = supabaseFilter(dataQuery, query.filters);
  }

  if (query.order) {
    dataQuery = dataQuery.order(query.order);
  }

  if (query.addlKeywords) {
    if ("SINGLE" in query.addlKeywords) {
      dataQuery = dataQuery.single();
    }
  }

  const { data, error } = await dataQuery;
  return { data, error };
}
