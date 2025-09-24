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

export type UpdateParams<Table> = Omit<
  Updateable<Table>,
  "id" | "createdAt" | "updatedAt"
>;
