import * as v from "valibot";
import { assert, test } from "vitest";
import { decodeForm } from "./decodable-schema";

function buildRequest(entries: Array<[string, string | File]>) {
  const formData = new FormData();
  for (const [key, value] of entries) {
    formData.append(key, value);
  }
  return new Request("http://localhost", { method: "POST", body: formData });
}

test("decodeForm: flat fields", async () => {
  const schema = v.object({ name: v.string(), email: v.string() });
  const request = buildRequest([
    ["name", "John"],
    ["email", "john@example.com"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.name === "John");
  assert(result.value.email === "john@example.com");
});

test("decodeForm: nested objects", async () => {
  const schema = v.object({
    user: v.object({
      name: v.string(),
      address: v.object({ city: v.string() }),
    }),
  });
  const request = buildRequest([
    ["user[name]", "John"],
    ["user[address][city]", "Tokyo"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.user.name === "John");
  assert(result.value.user.address.city === "Tokyo");
});

test("decodeForm: arrays with []", async () => {
  const schema = v.object({ tags: v.array(v.string()) });
  const request = buildRequest([
    ["tags[]", "a"],
    ["tags[]", "b"],
    ["tags[]", "c"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.tags.length === 3);
  assert(result.value.tags[0] === "a");
  assert(result.value.tags[1] === "b");
  assert(result.value.tags[2] === "c");
});

test("decodeForm: indexed arrays", async () => {
  const schema = v.object({ items: v.array(v.string()) });
  const request = buildRequest([
    ["items[0]", "first"],
    ["items[1]", "second"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.items[0] === "first");
  assert(result.value.items[1] === "second");
});

test("decodeForm: array of objects", async () => {
  const schema = v.object({
    items: v.array(v.object({ name: v.string(), price: v.string() })),
  });
  const request = buildRequest([
    ["items[0][name]", "Apple"],
    ["items[0][price]", "100"],
    ["items[1][name]", "Banana"],
    ["items[1][price]", "200"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.items.length === 2);
  const first = result.value.items[0];
  assert(first != null);
  assert(first.name === "Apple");
  assert(first.price === "100");
  const second = result.value.items[1];
  assert(second != null);
  assert(second.name === "Banana");
  assert(second.price === "200");
});

test("decodeForm: File value", async () => {
  const schema = v.object({
    name: v.string(),
    avatar: v.instance(File),
  });
  const file = new File(["content"], "avatar.png", { type: "image/png" });
  const request = buildRequest([
    ["name", "John"],
    ["avatar", file],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.name === "John");
  assert(result.value.avatar instanceof File);
});

test("decodeForm: nested File value", async () => {
  const schema = v.object({
    user: v.object({
      name: v.string(),
      avatar: v.instance(File),
    }),
  });
  const file = new File(["content"], "avatar.png", { type: "image/png" });
  const request = buildRequest([
    ["user[name]", "John"],
    ["user[avatar]", file],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.user.name === "John");
  assert(result.value.user.avatar instanceof File);
});

test("decodeForm: File array with []", async () => {
  const schema = v.object({
    photos: v.array(v.instance(File)),
  });
  const file1 = new File(["a"], "a.png", { type: "image/png" });
  const file2 = new File(["b"], "b.png", { type: "image/png" });
  const request = buildRequest([
    ["photos[]", file1],
    ["photos[]", file2],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.photos.length === 2);
  assert(result.value.photos[0] instanceof File);
  assert(result.value.photos[1] instanceof File);
});

test("decodeForm: duplicate keys combine into array", async () => {
  const schema = v.object({ tag: v.array(v.string()) });
  const request = buildRequest([
    ["tag", "a"],
    ["tag", "b"],
  ]);
  const result = await decodeForm(request, schema);
  assert(result.success);
  assert(result.value.tag.length === 2);
  assert(result.value.tag[0] === "a");
  assert(result.value.tag[1] === "b");
});
