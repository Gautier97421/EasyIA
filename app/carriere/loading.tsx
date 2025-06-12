import { Skeleton } from "@/components/ui/skeleton"

export default function CarriereLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-[600px] mx-auto mb-4" />
          <Skeleton className="h-6 w-[500px] mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-18" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
