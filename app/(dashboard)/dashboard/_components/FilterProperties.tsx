"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * FilterSection Component
 * 
 * A responsive filter interface for property listings that includes:
 * - Location selection (Major cities in Nepal)
 * - Property type filtering
 * - Number of bedrooms and bathrooms
 * - Price sorting options
 * - URL-based state management for shareable filtered views
 * 
 * Features:
 * - Responsive design with mobile-friendly sliding panel
 * - Persists filter state in URL parameters
 * - Clear all filters functionality
 * - Real-time filter updates
 */
function FilterSection() {
  // Router and search params hooks for navigation and URL management
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management for filter visibility and filter values
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("");

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParams) return;

    // Set other filters from URL
    setLocation(searchParams.get("location") || "");
    setPropertyType(searchParams.get("category") || "");
    setBedrooms(searchParams.get("noOfRooms") || "");
    setBathrooms(searchParams.get("noOfBathrooms") || "");
    setSort(searchParams.get("sort") || "");
  }, [searchParams]);

  // Available locations for property filtering
  const Locations = [
    { value: "Kathmandu", label: "Kathmandu" },
    { value: "Pokhara", label: "Pokhara" },
    { value: "Lalitpur", label: "Lalitpur" },
    { value: "Bhaktapur", label: "Bhaktapur" },
    { value: "Biratnagar", label: "Biratnagar" },
    { value: "Birgunj", label: "Birgunj" },
    { value: "Dharan", label: "Dharan" },
    { value: "Nepalgunj", label: "Nepalgunj" },
    { value: "Butwal", label: "Butwal" },
    { value: "Dhangadhi", label: "Dhangadhi" },
    { value: "Itahari", label: "Itahari" },
    { value: "Hetauda", label: "Hetauda" },
    { value: "Janakpur", label: "Janakpur" },
    { value: "Bharatpur", label: "Bharatpur" },
    { value: "Chitwan", label: "Chitwan" },
    { value: "Lumbini", label: "Lumbini" },
    { value: "Gorkha", label: "Gorkha" },
    { value: "Ilam", label: "Ilam" },
    { value: "Tansen", label: "Tansen" },
    { value: "Dhulikhel", label: "Dhulikhel" },
  ];

  /**
   * Handles the search/filter application
   * Updates URL with selected filter parameters
   */
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update URL parameters based on filter values
    if (location) params.set("location", location);
    else params.delete("location");

    if (propertyType) params.set("category", propertyType);
    else params.delete("category");

    if (bedrooms) params.set("noOfRooms", bedrooms.toString());
    else params.delete("noOfRooms");

    if (bathrooms) params.set("noOfBathrooms", bathrooms.toString());
    else params.delete("noOfBathrooms");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    // Navigate to current page with updated filters
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  /**
   * Resets all filters to their default values
   * and removes query parameters from URL
   */
  const clearFilters = () => {
    setLocation("");
    setPropertyType("");
    setBedrooms("");
    setBathrooms("");
    setSort("");
    router.push(window.location.pathname);
  };

  /**
   * Toggles the visibility of filter panel on mobile devices
   */
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div className="">
      {/* Mobile filter toggle button */}
      <Button
        onClick={toggleFilter}
        className="lg:hidden absolute top-11 right-4  text-white px-6 py-5 rounded-xl text-sm z-50 "
      >
        {isFilterVisible ? "Close " : "Filter"}
      </Button>

      {/* Filter Section */}
      <div
        className={`
                fixed lg:relative top-0 left-0 h-screen 
                bg-white shadow-lg overflow-y-auto 
                w-[280px] lg:w-[20vw] px-6 
                transition-transform duration-300 ease-in-out z-40
                ${isFilterVisible
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
            `}
      >
        <div className="py-8 space-y-6">
          {/* Title with clear button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Sort Order */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2 font-medium">
              Sort By Price
            </label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">No Sort</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2 font-medium">
              Location
            </label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {Locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Dropdown */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2 font-medium">
              Property Type
            </label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Select Property Type</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="COMMERCIAL_SPACE">Commercial Space</option>
              <option value="ROOM">Room</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2 font-medium">
              Bedrooms
            </label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div className="w-full">
            <label className="block text-gray-700 mb-2 font-medium">
              Bathrooms
            </label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Bathroom" : "Bathrooms"}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="pt-6">
            <button
              onClick={handleSearch}
              className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
