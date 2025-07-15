"use client";

import React, { Suspense } from "react";
import { ResourceTable } from "@/components/resource-table";
import { mockData } from "@/data/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">PACT AI Resource Dashboard</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ResourceTable data={mockData} />
        </Suspense>
      </div>
    </main>
  );
}
