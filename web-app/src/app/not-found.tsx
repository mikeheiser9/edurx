import Link from "next/link";

export default () => {
  return (
    <main className="flex flex-auto w-full justify-center items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/forum"
            className="rounded-md bg-eduDarkBlue px-3.5 py-2.5 text-sm font-semibold shadow-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};
