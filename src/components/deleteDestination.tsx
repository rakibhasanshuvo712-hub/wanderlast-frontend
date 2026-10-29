'use client'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from 'react';

const DeleteDestination = ({ id }: { id: string }) => {
   const router = useRouter()

  const handleDeleteDestination = async () => {
    try {
      const res = await fetch(`${API_BASE}/destinations/${id}`, {
        method: "DELETE",
      })
      if (res.status === 401) {
        // Session expired — send the user to login and back here.
        router.push(
          `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`
        )
        return
      }
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`)
      }
      router.push("/destinations")
      router.refresh()
    } catch (err) {
      console.error("Failed to delete destination:", err)
      window.alert("Could not delete this destination. Please try again.")
    }
  }
    return (
        
            <AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
    Delete
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this
        destination from the listings.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteDestination}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        
    );
};

export default DeleteDestination;