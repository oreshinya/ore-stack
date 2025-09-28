import { Form, Link } from "react-router";
import type { Route } from "./+types/_route";

export { action } from "./action";
export { loader } from "./loader";

export default function SampleEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { sample } = loaderData;

  return (
    <div>
      <nav>
        <ul>
          <li>
            <h1>Edit Sample</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">Back to list</Link>
          </li>
          <li>
            <Link to={`/samples/${sample.id}`}>View detail</Link>
          </li>
        </ul>
      </nav>
      <Form method="post">
        <fieldset>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                defaultValue={sample.name}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="active"
                defaultChecked={sample.active}
              />
              Active
            </label>
          </div>
        </fieldset>
        {actionData?.message && <small>{actionData.message}</small>}
        <button type="submit">Update Sample</button>
      </Form>
    </div>
  );
}
