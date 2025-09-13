import "the-new-css-reset/css/reset.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import { useHook } from "./hook";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export function Layout({ children }: { children: React.ReactNode }) {
  const { nonce, isPending } = useHook();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={cx("content")}>{children}</div>
        <div className={cx("spinner", { shown: isPending })}>
          <progress />
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {
  let status = 500;
  if (isRouteErrorResponse(error)) {
    status = error.status;
  }

  return <div className={cx("error-status")}>{status}</div>;
}
