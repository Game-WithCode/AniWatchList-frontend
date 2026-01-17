// lib/getTopAnime.js

let cacheStore = {};
let lastFetchTime = {};

export async function getTopAnimeCached(category) {

  const now = Date.now();
  const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  if (cacheStore[category] && now - lastFetchTime[category] < CACHE_DURATION) {
    console.log("✅ Serving from memory cache");
    return cacheStore[category];
  }
       const api = process.env.NEXT_PUBLIC_BACKEND_URL

  console.log("🌐 Fetching fresh data from backend...");
  const res = await fetch(`${api}/api/${category}/top`, {
    cache: "force-store",
  });

  const data = await res.json();

  // Save to memory
  cacheStore[category] = data;
  lastFetchTime[category] = now;

  return data;
}
