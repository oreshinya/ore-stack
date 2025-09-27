import { db } from "~/adapters/db/client";
import { createSample, updateSample } from "./command";

test("createSample", async () => {
  const result1 = await createSample(db, { name: "test", active: true });
  assert(result1.success);
  assert(result1.value.id.length === 26);
  assert(result1.value.name === "test");
  assert(result1.value.active);

  const result2 = await createSample(db, { name: "", active: true });
  assert(!result2.success);
  assert(result2.message === "Name is required.");
});

test("updateSample", async () => {
  const result1 = await createSample(db, { name: "test", active: true });
  assert(result1.success);
  const sample = result1.value;

  const result2 = await updateSample(db, sample, {
    name: "updated",
    active: false,
  });
  assert(result2.success);
  assert(result2.value.id.length === 26);
  assert(result2.value.name === "updated");
  assert(!result2.value.active);

  const result3 = await updateSample(db, sample, { name: "", active: false });
  assert(!result3.success);
  assert(result3.message === "Name is required.");
});
