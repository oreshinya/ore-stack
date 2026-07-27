import { Form, Link } from "react-router";
import { m } from "~/translations";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { action } from "./action";
export { loader } from "./loader";

export default function SampleEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { sample } = loaderData;
  const { t } = useHook();

  return (
    <div className="container">
      <title>{t(m.ui.sample.edit.title)}</title>
      <nav>
        <ul>
          <li>
            <h1>{t(m.ui.sample.edit.title)}</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">{t(m.ui.common.backToList)}</Link>
          </li>
          <li>
            <Link to={`/samples/${sample.id}`}>
              {t(m.ui.sample.edit.viewDetail)}
            </Link>
          </li>
        </ul>
      </nav>
      <Form method="post">
        <fieldset>
          <div>
            <label>
              {t(m.ui.sample.common.nameLabel)}
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
                defaultChecked={!!sample.active}
              />
              {t(m.ui.sample.common.active)}
            </label>
          </div>
        </fieldset>
        {actionData?.message && <small>{actionData.message}</small>}
        <button type="submit">{t(m.ui.sample.edit.update)}</button>
      </Form>
    </div>
  );
}
