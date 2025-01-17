import type { LinksFunction } from '@remix-run/node';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1 className="text-4xl font-bold mb-8">
          {isRouteErrorResponse(error)
            ? `${error.status} - ${error.statusText}`
            : error instanceof Error
            ? error.message
            : 'Unknown Error'}
        </h1>
        <button className="border border-black hover:border-gray-400 ml-4 py-1 px-2">
          <Link to="/">go home</Link>
        </button>
        <Scripts />
      </body>
    </html>
  );
}
