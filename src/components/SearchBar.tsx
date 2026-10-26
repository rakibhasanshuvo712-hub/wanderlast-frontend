"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SearchIcon, MapPinIcon, CalendarIcon, CreditCardIcon, UsersIcon } from "lucide-react"

const fields = [
  {
    id: "location",
    label: "Location",
    placeholder: "Address, City Or Zip",
    icon: MapPinIcon,
  },
  {
    id: "date",
    label: "Date/Duration",
    placeholder: "Anytime/3 Days",
    icon: CalendarIcon,
  },
  {
    id: "budget",
    label: "Budget",
    placeholder: "$0–$2,600",
    icon: CreditCardIcon,
  },
  {
    id: "people",
    label: "People",
    placeholder: "5–10",
    icon: UsersIcon,
  },
]

export function SearchBar() {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
    budget: "",
    people: "",
  })

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 -bottom-10">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl shadow-black/20 p-4 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end"
        >
          {fields.map((field) => {
            const Icon = field.icon
            return (
              <div key={field.id} className="flex flex-col gap-1.5">
                <Label htmlFor={field.id} className="text-sm font-medium text-slate-700">
                  {field.label}
                </Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="pl-10 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )
          })}
          <div className="flex items-end">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/50 w-full sm:w-auto"
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Search
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
