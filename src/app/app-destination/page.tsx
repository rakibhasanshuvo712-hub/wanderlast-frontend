import type { Metadata } from "next"
import { DestinationForm } from "@/components/destination-form"

export const metadata: Metadata = {
  title: "Add a travel package",
}

export default function AddDestination() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Add New Travel Package
          </h1>
          <p className="mt-2 text-muted-foreground">
            Publish a new destination to the listings.
          </p>
        </div>

        <DestinationForm />
      </div>
    </div>
  )
}
