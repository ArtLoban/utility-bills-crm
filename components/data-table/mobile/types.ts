export type TMobileSortField<TId extends string = string> = {
  readonly id: TId;
  readonly defaultDesc: boolean;
};

export type TResolvedSort = {
  id: string;
  desc: boolean;
};
