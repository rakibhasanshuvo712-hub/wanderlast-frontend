import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DestinationForm } from "@/components/destination-form";
import { buttonVariants } from "@/components/ui/button";
import { apiUrl } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Edit travel package",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDestinationPage({ params }: EditPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/app-destination/${id}`)}`);
  }

  let doc: Record<string, unknown> | null = null;
  let unavailable = false;
  let missing = false;

  try {
    const res = await fetch(await apiUrl(`/destinations/${id}`), {
      cache: "no-store",
    });

    if (res.status === 400 || res.status === 404) {
      missing = true;
    } else if (!res.ok) {
      unavailable = true;
    } else {
      doc = (await res.json()) as Record<string, unknown>;
    }
  } catch (err) {
    console.error("Failed to load destination for editing:", err);
    unavailable = true;
  }

  if (unavailable) {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            This package can&apos;t be edited right now
          </h1>
          <p className="mt-3 text-muted-foreground">
            We couldn&apos;t load the destination. Please try again in a moment.
          </p>
          <Link
            href="/destinations"
            className={`${buttonVariants({ variant: "outline" })} mt-8`}
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  if (missing || !doc) {
    notFound();
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Edit Travel Package
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update the listing and save your changes.
          </p>
        </div>

        <DestinationForm
          id={id}
          initial={{
            name: typeof doc.name === "string" ? doc.name : "",
            country: typeof doc.country === "string" ? doc.country : "",
            category: typeof doc.category === "string" ? doc.category : "Beach",
            price: typeof doc.price === "string" ? doc.price : String(doc.price ?? ""),
            duration: typeof doc.duration === "string" ? doc.duration : "",
            departureDate:
              typeof doc.departureDate === "string" ? doc.departureDate : "",
            imageUrl: typeof doc.imageUrl === "string" ? doc.imageUrl : "",
            description:
              typeof doc.description === "string" ? doc.description : "",
          }}
        />
      </div>
    </div>
  );
}
