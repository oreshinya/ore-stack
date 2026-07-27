import { Link } from "react-router";
import { m } from "~/translations";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { loader } from "./loader";

export default function SampleIndex({ loaderData }: Route.ComponentProps) {
  const { samples } = loaderData;
  const { t } = useHook();

  return (
    <div className="container">
      <title>{t(m.ui.sample.list.title)}</title>
      <nav>
        <ul>
          <li>
            <h1>{t(m.ui.sample.list.title)}</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples/new">{t(m.ui.sample.list.newSample)}</Link>
          </li>
        </ul>
      </nav>
      <table>
        <thead>
          <tr>
            <th>{t(m.ui.sample.common.id)}</th>
            <th>{t(m.ui.sample.common.name)}</th>
            <th>{t(m.ui.sample.common.active)}</th>
            <th>{t(m.ui.sample.list.actions)}</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr key={sample.id}>
              <td>{sample.id}</td>
              <td>{sample.name}</td>
              <td>{sample.active ? t(m.ui.common.yes) : t(m.ui.common.no)}</td>
              <td>
                <Link to={`/samples/${sample.id}`}>
                  {t(m.ui.sample.list.view)}
                </Link>
                {" | "}
                <Link to={`/samples/${sample.id}/edit`}>
                  {t(m.ui.sample.common.edit)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {samples.length === 0 && <p>{t(m.ui.sample.list.empty)}</p>}
    </div>
  );
}
