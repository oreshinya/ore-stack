import type { Insertable, Updateable } from "kysely";

export interface TableBase<Id> {
  id: Id;
  createdAt: string;
  updatedAt: string;
}

export type CreateParams<Table> = Omit<
  Insertable<Table>,
  "id" | "createdAt" | "updatedAt"
>;

type StripUndefined<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

export type UpdateParams<Table> = StripUndefined<
  Omit<Updateable<Table>, "id" | "createdAt" | "updatedAt">
>;
