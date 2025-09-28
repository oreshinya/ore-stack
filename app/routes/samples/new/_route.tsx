import { Form, Link } from "react-router";
import type { Route } from "./+types/_route";

export { action } from "./action";

export default function SampleNew({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <h1>Create New Sample</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">Back to list</Link>
          </li>
        </ul>
      </nav>
      <Form method="post">
        <fieldset>
          <div>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" name="active" defaultChecked />
              Active
            </label>
          </div>
        </fieldset>
        {actionData?.message && <small>{actionData.message}</small>}
        <button type="submit">Create Sample</button>
      </Form>
    </div>
  );
}
