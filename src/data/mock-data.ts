import { ResourceWrapper, ProcessingState, FHIRVersion } from "@/types/resource";

export const mockData: ResourceWrapper[] = [
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: "2025-07-10T10:00:00Z",
        fetchTime: "2025-07-10T10:05:00Z",
        processedTime: "2025-07-10T10:10:00Z",
        identifier: {
          key: "res-001",
          uid: "uid-001",
          patientId: "patient-001",
        },
        resourceType: "Patient",
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: "Patient is a 65-year-old male with hypertension.",
      aiSummary: "Elderly patient with chronic hypertension.",
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_FAILED,
        createdTime: "2025-07-09T08:20:00Z",
        fetchTime: "2025-07-09T08:25:00Z",
        processedTime: undefined,
        identifier: {
          key: "res-002",
          uid: "uid-002",
          patientId: "patient-002",
        },
        resourceType: "Observation",
        version: FHIRVersion.FHIR_VERSION_R4B,
      },
      humanReadableStr: "Blood pressure reading unavailable.",
      aiSummary: undefined,
    },
  },
];
