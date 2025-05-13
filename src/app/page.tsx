"use client";
import Image from "next/image";
import { useState } from "react";

// Define a type for Met objects
interface MetObject {
  objectID: number;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MetObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [objectIDs, setObjectIDs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  async function fetchPageWithImages(page: number) {
    setLoading(true);
    setError("");
    setResults([]);
    setCurrentPage(page);
    try {
      const startIdx = (page - 1) * resultsPerPage;
      let found: MetObject[] = [];
      let idx = startIdx;
      // Keep fetching until we have 9 with images or run out of IDs
      while (found.length < resultsPerPage && idx < objectIDs.length) {
        const batch = objectIDs.slice(idx, idx + (resultsPerPage * 2)); // fetch in batches for efficiency
        const detailPromises = batch.map((id: number) =>
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then((r) => r.json())
        );
        const details = await Promise.all(detailPromises);
        const withImages = details.filter((obj): obj is MetObject => obj.primaryImageSmall && obj.objectID);
        found = found.concat(withImages);
        idx += batch.length;
      }
      setResults(found.slice(0, resultsPerPage));
    } catch {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function goToPage(page: number) {
    await fetchPageWithImages(page);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    setObjectIDs([]);
    setCurrentPage(1);
    try {
      // Search API call
      const searchRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}`
      );
      const searchData = await searchRes.json();
      if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
        setResults([]);
        setObjectIDs([]);
        setLoading(false);
        return;
      }
      setObjectIDs(searchData.objectIDs);
      await fetchPageWithImages(1);
    } catch {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(objectIDs.length / resultsPerPage); // This is an upper bound, but fine for navigation

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 font-sans bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 mt-8">Met Museum Search</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8 w-full max-w-xl">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the Met collection..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {(query || results.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setObjectIDs([]);
                setCurrentPage(1);
                setError("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition text-xl focus:outline-none"
              aria-label="Clear search"
              disabled={loading}
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && (
        <div className="flex justify-center items-center w-full my-8">
          <div className="flex space-x-2">
            <span className="block w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
            <span className="block w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
            <span className="block w-4 h-4 bg-blue-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {results.filter(obj => obj && obj.objectID).map((obj, idx) => (
          <div key={obj.objectID ?? idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <Image
              src={obj.primaryImageSmall}
              alt={obj.title}
              width={160}
              height={160}
              className="w-40 h-40 object-contain mb-2 rounded"
              style={{ objectFit: 'contain' }}
              priority={idx < 3}
            />
            <div className="font-semibold text-center mb-1">{obj.title}</div>
            <div className="text-sm text-gray-600 text-center">{obj.artistDisplayName || "Unknown Artist"}</div>
            <div className="text-xs text-gray-400 text-center mt-1">{obj.objectDate}</div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {objectIDs.length > 0 && (
        <div className="flex gap-4 items-center justify-center mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {results.length === 0 && !loading && (
        <div className="text-gray-500 mt-8">No results yet. Try searching for something!</div>
      )}
    </div>
  );
}
