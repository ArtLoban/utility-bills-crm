export type TMobileSortField<TId extends string = string> = {
  readonly id: TId;
  readonly defaultDesc: boolean;
};

export type TResolvedSort<TId extends string = string> = {
  id: TId;
  desc: boolean;
};
