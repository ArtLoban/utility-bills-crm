import { headers } from "next/headers";
import { CORRELATION_ID_HEADER } from "./constants";

export const getCorrelationId = async (): Promise<string> => {
  const headersList = await headers();
  return headersList.get(CORRELATION_ID_HEADER) ?? "no-correlation-id";
};
