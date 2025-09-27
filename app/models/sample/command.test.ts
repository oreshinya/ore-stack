import { db } from "~/adapters/db/client";
import { createSample } from "./command";

test("createSample", async () => {
  const result = await createSample(db, { name: "test", active: true });
  assert(result.success);
  assert(result.value.id.length === 26);
  assert(result.value.name === "test");
  assert(result.value.active);
});
