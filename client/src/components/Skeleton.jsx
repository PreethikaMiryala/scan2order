function Skeleton({ className = "" }) {
  return <div className={`shimmer rounded-2xl bg-[#1F1A17]/10 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="luxury-card overflow-hidden rounded-3xl">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_1fr_0.6fr_0.7fr_0.7fr] lg:items-center lg:px-5">
      <div className="flex gap-4">
        <Skeleton className="h-16 w-16 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-10 w-32 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
  );
}

export default Skeleton;
