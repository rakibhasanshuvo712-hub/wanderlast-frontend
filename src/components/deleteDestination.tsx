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
      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`)
      }
      router.push("/destinations")
      router.refresh()
    } catch (err) {
      console.error("Failed to delete destination:", err)
      window.alert("Could not delete this destination. Is the backend server running?")
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
        This action cannot be undone. This will permanently delete your account
        from our servers.
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