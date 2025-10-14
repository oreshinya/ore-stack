import { Link } from "react-router";
import type { Route } from "./+types/_route";

export { loader } from "./loader";

export default function SampleIndex({ loaderData }: Route.ComponentProps) {
  const { samples } = loaderData;

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <h1>Samples</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples/new">Create New Sample</Link>
          </li>
        </ul>
      </nav>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={sample.id}>
              <td>{sample.id}</td>
              <td>{sample.name}</td>
              <td>{sample.active ? "Yes" : "No"}</td>
              <td>
                <Link to={`/samples/${sample.id}`}>View</Link>
                {" | "}
                <Link to={`/samples/${sample.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {samples.length === 0 && <p>No samples found.</p>}
    </div>
  );
}
