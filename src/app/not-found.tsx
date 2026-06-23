import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center container-px">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-display-md font-semibold text-foreground mb-6">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="text-foreground-secondary mb-8 max-w-sm">
        The page you&rsquo;re looking for may have been moved or is no longer available.
      </p>
      <Link href="/" className="btn-primary">
        Back To Home
      </Link>
    </div>
  );
}
