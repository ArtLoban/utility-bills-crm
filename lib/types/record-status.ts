export const RECORD_STATUS = {
  ACTIVE: "active",
  DELETED: "deleted",
} as const;

export type TRecordStatus = (typeof RECORD_STATUS)[keyof typeof RECORD_STATUS];

export const RECORD_STATUS_LIST = [RECORD_STATUS.ACTIVE, RECORD_STATUS.DELETED] as const;
