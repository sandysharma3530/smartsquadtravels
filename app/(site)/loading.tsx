export default function SiteLoading() {
  return (
    <div className="container-site section-pad" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
      <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        <div className="hidden h-40 animate-pulse rounded-2xl bg-slate-200 sm:block" />
      </div>
    </div>
  );
}
