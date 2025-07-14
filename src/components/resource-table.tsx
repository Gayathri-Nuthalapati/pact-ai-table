// src/components/resource-table.tsx
"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ResourceWrapper } from "@/types/resource";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

type Props = {
  data: ResourceWrapper[];
};

export function ResourceTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<ResourceWrapper>[] = [
    {
      id: "patientId",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
      cell: ({ getValue }) =>
        format(new Date(getValue<string>()), "PPpp"),
    },
    {
      id: "processed",
      header: "Processed",
      accessorFn: (row) => row.resource.metadata.processedTime || "N/A",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return val !== "N/A" ? (
          format(new Date(val), "PPpp")
        ) : (
          <span className="italic text-gray-500">N/A</span>
        );
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
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {val}
          </div>
        ) : (
          <span className="italic text-gray-500">N/A</span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border shadow-md p-4 sm:p-6">
      <Table className="min-w-[900px] w-full text-sm">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs text-gray-500 uppercase tracking-wide"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-2 px-3">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
