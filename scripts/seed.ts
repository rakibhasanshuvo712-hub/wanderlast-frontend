/**
 * Seed script to populate MongoDB with sample destinations.
 * Run with: npx tsx scripts/seed.ts
 */

import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

const destinations = [
  {
    name: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: "2700",
    duration: "7 Days/6 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1537996227162-0747f7a84bb0?w=800&q=80",
    rating: 4.5,
    reviews: 214,
    departureDate: "2026-11-14",
    description:
      "Rice terraces, temple sunsets and warm Indian Ocean water. Seven slow days split between Ubud's jungle and the beaches of the south coast.",
    highlights: [
      "Private transfer from Denpasar airport",
      "Sunrise trek above the Tegallalang rice terraces",
      "Traditional Balinese cooking class",
      "Snorkelling trip around Nusa Penida",
    ],
    exclusions: ["International flights", "Travel insurance", "Personal expenses"],
  },
  {
    name: "Maldives Escape",
    country: "Maldives",
    category: "Island",
    price: "3200",
    duration: "5 Days/4 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428434-75ae89759d2f?w=800&q=80",
    rating: 4.8,
    reviews: 186,
    departureDate: "2026-12-02",
    description:
      "Overwater villas, reef drops a few strokes from your ladder and nothing on the agenda but the tide. Five days of doing very little, very well.",
    highlights: [
      "Overwater bungalow with glass-floor panel",
      "Daily breakfast and dinner included",
      "Guided house-reef snorkelling",
      "Sunset dolphin cruise",
    ],
    exclusions: ["International flights", "Seaplane transfer", "Spa treatments"],
  },
  {
    name: "Swiss Alps Adventure",
    country: "Switzerland",
    category: "Mountain",
    price: "2900",
    duration: "8 Days/7 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    rating: 4.6,
    reviews: 302,
    departureDate: "2026-10-30",
    description:
      "Eight days of high trails, glacier trains and alpine huts. Ridge walks by day, fondue and a hot shower by night.",
    highlights: [
      "Guided hike across the Eiger Trail",
      "Glacier Express scenic rail journey",
      "Cable car to Jungfraujoch",
      "Six nights in family-run mountain guesthouses",
    ],
    exclusions: ["International flights", "Lift passes not listed", "Lunches"],
  },
  {
    name: "Kyoto Cultural Tour",
    country: "Japan",
    category: "City",
    price: "2400",
    duration: "6 Days/5 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1493976040374-85c877967a1e?w=800&q=80",
    rating: 4.7,
    reviews: 268,
    departureDate: "2026-11-20",
    description:
      "Temples at opening hour, tea houses after dark. Six days walking Kyoto's old districts with a local guide who knows which lane to take.",
    highlights: [
      "Early-morning walk through Fushimi Inari",
      "Private tea ceremony in Gion",
      "Arashiyama bamboo grove before the crowds",
      "Kaiseki dinner with a local family",
    ],
    exclusions: ["International flights", "Rail pass", "Alcohol beyond dinner"],
  },
  {
    name: "Safari Serengeti",
    country: "Tanzania",
    category: "Desert",
    price: "3800",
    duration: "9 Days/8 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1533078472371-71902a5f2067?w=800&q=80",
    rating: 4.9,
    reviews: 151,
    departureDate: "2026-09-18",
    description:
      "Nine days following the herds across the Serengeti and into the Ngorongoro crater, sleeping in tented camps under an unlit sky.",
    highlights: [
      "Two game drives per day with a private guide",
      "Hot-air balloon safari at dawn",
      "Ngorongoro crater descent",
      "Nights in luxury tented camps",
    ],
    exclusions: ["International flights", "Park visa fees", "Tips for guides"],
  },
  {
    name: "Santorini Getaway",
    country: "Greece",
    category: "Island",
    price: "3100",
    duration: "6 Days/5 Nights",
    imageUrl:
      "https://images.unsplash.com/photo-1570083018299-68a22e96f746?w=800&q=80",
    rating: 4.7,
    reviews: 197,
    departureDate: "2026-06-05",
    description:
      "Whitewashed villages, caldera views and slow evenings in Oia. Six days of island-hopping, wine tasting and very good tomatoes.",
    highlights: [
      "Caldera sunset cruise with dinner on board",
      "Wine tasting at a Santo Winery estate",
      "Guided walk through Akrotiri ruins",
      "Five nights in a cave-suite with a private terrace",
    ],
    exclusions: ["International flights", "Ferry transfers", "Optional tours"],
  },
]

async function main() {
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env.local")
    process.exit(1)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db("wanderlust")
    const collection = db.collection("destination")

    await collection.deleteMany({})
    await collection.insertMany(destinations)
    console.log(`Seeded ${destinations.length} destinations into MongoDB!`)
  } catch (err) {
    console.error("Seed failed:", err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
