"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Funnel, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ResourceWrapper } from "@/types/resource";
import { Dialog } from "./ui/dialog";

// ✅ Inline fallback if "@/components/ui/table" fails
const Table = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table {...props}>{children}</table>
);
const TableHeader = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
const TableRow = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props}>{children}</tr>
);
const TableHead = ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th {...props}>{children}</th>
);
const TableCell = ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...props}>{children}</td>
);

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type Props = {
  data: ResourceWrapper[];
};

export function ResourceTable({ data }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(searchParams.get("status")?.split(",") || []);
  const [selectedType, setSelectedType] = useState<string[]>(searchParams.get("type")?.split(",") || []);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStatus.length) params.set("status", selectedStatus.join(","));
    if (selectedType.length) params.set("type", selectedType.join(","));
    if (searchTerm) params.set("search", searchTerm);
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedStatus, selectedType, searchTerm, router, pathname]);

  const uniqueStatuses = useMemo(() => Array.from(new Set(data.map((d) => d.resource.metadata.state))), [data]);
  const uniqueTypes = useMemo(() => Array.from(new Set(data.map((d) => d.resource.metadata.resourceType))), [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const id = item.resource.metadata.identifier.patientId.toLowerCase();
      const matchesSearch = id.includes(debouncedSearch.toLowerCase());
      const statusMatch = selectedStatus.length === 0 || selectedStatus.includes(item.resource.metadata.state);
      const typeMatch = selectedType.length === 0 || selectedType.includes(item.resource.metadata.resourceType);
      return matchesSearch && statusMatch && typeMatch;
    });
  }, [data, selectedStatus, selectedType, debouncedSearch]);

  const columns: ColumnDef<ResourceWrapper>[] = [
    {
      id: "patientId",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient ID <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      accessorFn: (row) => row.resource.metadata.identifier.patientId,
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (row) => row.resource.metadata.resourceType,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => row.resource.metadata.state,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        const statusColor = {
          PROCESSING_STATE_COMPLETED: "bg-green-100 text-green-700",
          PROCESSING_STATE_FAILED: "bg-red-100 text-red-700",
          PROCESSING_STATE_PROCESSING: "bg-yellow-100 text-yellow-800",
          PROCESSING_STATE_NOT_STARTED: "bg-gray-100 text-gray-700",
        }[value] || "bg-gray-100 text-gray-700";

        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
            {value.replace("PROCESSING_STATE_", "")}
          </span>
        );
      },
    },
    {
      id: "fhirVersion",
      header: "FHIR Ver.",
      accessorFn: (row) => row.resource.metadata.version,
    },
    {
      id: "created",
      header: "Created",
      accessorFn: (row) => row.resource.metadata.createdTime,
      cell: ({ getValue }) => format(new Date(getValue<string>()), "PPpp"),
    },
    {
      id: "processed",
      header: "Processed",
      accessorFn: (row) => row.resource.metadata.processedTime || "N/A",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return val !== "N/A" ? format(new Date(val), "PPpp") : <span className="italic text-gray-500">N/A</span>;
      },
    },
    {
      id: "summary",
      header: "Summary",
      accessorFn: (row) => row.resource.humanReadableStr,
      cell: ({ getValue }) => (
        <div className="whitespace-pre-wrap text-sm">{getValue<string>()}</div>
      ),
    },
    {
      id: "aiInsight",
      header: "AI Insight",
      accessorFn: (row) => row.resource.aiSummary || "N/A",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return val !== "N/A" ? (
          <div className="whitespace-pre-wrap text-sm text-gray-700">{val}</div>
        ) : (
          <span className="italic text-gray-500">N/A</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const toggleSelection = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setSelectedType([]);
    setSorting([]);
    setShowFilter(false);
  };

  return (
    <div className="relative">
      {/* Search + Filter Controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search Patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100"
          >
            <Funnel className="w-4 h-4" /> Filter
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            aria-label="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Modal Filter Panel */}
      <Dialog open={showFilter} onOpenChange={setShowFilter}>

        <button
              onClick={() => setShowFilter(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close filter panel"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Filter Resources</h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Status</h3>
              <div className="max-h-40 overflow-auto border rounded p-2">
                {uniqueStatuses.map((status) => (
                  <label key={status} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={() => toggleSelection(status, selectedStatus, setSelectedStatus)}
                    />
                    <span>{status.replace("PROCESSING_STATE_", "")}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Type</h3>
              <div className="max-h-40 overflow-auto border rounded p-2">
                {uniqueTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedType.includes(type)}
                      onChange={() => toggleSelection(type, selectedType, setSelectedType)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={handleReset}>
                <RotateCcw className="inline w-4 h-4 mr-1" /> Reset
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowFilter(false)}
              >
                Apply
              </button>
            </div>
          
      </Dialog>
      

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border shadow-md p-4 sm:p-6">
        <Table className="min-w-[900px] w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs text-gray-500 uppercase tracking-wide">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2 px-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
