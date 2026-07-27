import { Link } from "react-router";
import { m } from "~/translations";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { loader } from "./loader";

export default function SampleShow({ loaderData }: Route.ComponentProps) {
  const { sample } = loaderData;
  const { t } = useHook();

  return (
    <div className="container">
      <title>{t(m.ui.sample.detail.title)}</title>
      <nav>
        <ul>
          <li>
            <h1>{t(m.ui.sample.detail.title)}</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">{t(m.ui.common.backToList)}</Link>
          </li>
          <li>
            <Link to={`/samples/${sample.id}/edit`}>
              {t(m.ui.sample.common.edit)}
            </Link>
          </li>
        </ul>
      </nav>
      <dl>
        <dt>{t(m.ui.sample.common.id)}</dt>
        <dd>{sample.id}</dd>
        <dt>{t(m.ui.sample.common.name)}</dt>
        <dd>{sample.name}</dd>
        <dt>{t(m.ui.sample.common.active)}</dt>
        <dd>{sample.active ? t(m.ui.common.yes) : t(m.ui.common.no)}</dd>
      </dl>
    </div>
  );
}
