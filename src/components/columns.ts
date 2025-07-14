import { ColumnDef } from "@tanstack/react-table";
import { ResourceWrapper } from "@/types/resource";

export const columns: ColumnDef<ResourceWrapper>[] = [
  {
    accessorFn: (row) => row.resource.metadata.identifier.patientId,
    header: "Patient ID",
    id: "patientId",
  },
  {
    accessorFn: (row) => row.resource.metadata.resourceType,
    header: "Resource Type",
    id: "resourceType",
  },
  {
    accessorFn: (row) => row.resource.metadata.state,
    header: "State",
    id: "state",
  },
  {
    accessorFn: (row) => row.resource.metadata.version,
    header: "FHIR Version",
    id: "version",
  },
  {
    accessorFn: (row) => row.resource.metadata.createdTime,
    header: "Created At",
    id: "createdTime",
  },
  {
    accessorFn: (row) => row.resource.metadata.processedTime ?? "N/A",
    header: "Processed Time",
    id: "processedTime",
  },
  {
    accessorFn: (row) => row.resource.humanReadableStr,
    header: "Human Readable",
    id: "humanReadableStr",
  },
  {
    accessorFn: (row) => row.resource.aiSummary ?? "N/A",
    header: "AI Summary",
    id: "aiSummary",
  },
];
