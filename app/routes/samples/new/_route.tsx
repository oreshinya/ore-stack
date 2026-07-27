import { Form, Link } from "react-router";
import { m } from "~/translations";
import type { Route } from "./+types/_route";
import { useHook } from "./hook";

export { action } from "./action";

export default function SampleNew({ actionData }: Route.ComponentProps) {
  const { t } = useHook();

  return (
    <div className="container">
      <title>{t(m.ui.sample.creation.title)}</title>
      <nav>
        <ul>
          <li>
            <h1>{t(m.ui.sample.creation.title)}</h1>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/samples">{t(m.ui.common.backToList)}</Link>
          </li>
        </ul>
      </nav>
      <Form method="post">
        <fieldset>
          <div>
            <label>
              {t(m.ui.sample.common.nameLabel)}
              <input type="text" name="name" required />
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" name="active" defaultChecked />
              {t(m.ui.sample.common.active)}
            </label>
          </div>
        </fieldset>
        {actionData?.message && <small>{actionData.message}</small>}
        <button type="submit">{t(m.ui.sample.creation.create)}</button>
      </Form>
    </div>
  );
}
