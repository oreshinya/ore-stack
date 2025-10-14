import { Link } from "react-router";
import type { Route } from "./+types/_route";

export { loader } from "./loader";

export default function SampleShow({ loaderData }: Route.ComponentProps) {
  const { sample } = loaderData;

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <h1>Sample Detail</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">Back to list</Link>
          </li>
          <li>
            <Link to={`/samples/${sample.id}/edit`}>Edit</Link>
          </li>
        </ul>
      </nav>
      <dl>
        <dt>ID</dt>
        <dd>{sample.id}</dd>
        <dt>Name</dt>
        <dd>{sample.name}</dd>
        <dt>Active</dt>
        <dd>{sample.active ? "Yes" : "No"}</dd>
      </dl>
    </div>
  );
}
