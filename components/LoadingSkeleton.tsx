export function ServiceCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border-t-2 border-secondary/20 animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>

      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

      <div className="flex justify-between items-center pt-4 border-t border-secondary/10">
        <div>
          <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="text-right">
          <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      {Array.from({ length: count }).map((_, idx) => (
        <ServiceCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function HomeServiceCardSkeleton() {
  return (
    <div className="relative group overflow-hidden bg-primary-container rounded-lg animate-pulse">
      <div className="h-64 bg-gray-300"></div>
      <div className="absolute bottom-0 p-6 w-full">
        <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-5 bg-white/80 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-white/80 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

export function BookingServiceSkeleton() {
  return (
    <div className="flex items-center justify-between p-6 rounded-lg bg-surface-container-low animate-pulse">
      <div className="flex items-center gap-stack-md flex-1">
        <div className="w-12 h-12 rounded bg-gray-300"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
}
