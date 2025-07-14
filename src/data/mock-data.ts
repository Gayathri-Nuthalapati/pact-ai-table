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
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_NOT_STARTED,
        createdTime: "2025-07-08T07:00:00Z",
        fetchTime: "2025-07-08T07:05:00Z",
        identifier: {
          key: "res-003",
          uid: "uid-003",
          patientId: "patient-003",
        },
        resourceType: "Condition",
        version: FHIRVersion.FHIR_VERSION_UNSPECIFIED,
      },
      humanReadableStr: "No processing has started yet for this patient.",
      aiSummary: "Processing pending.",
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_PROCESSING,
        createdTime: "2025-07-07T06:30:00Z",
        fetchTime: "2025-07-07T06:32:00Z",
        identifier: {
          key: "res-004",
          uid: "uid-004",
          patientId: "patient-004",
        },
        resourceType: "MedicationRequest",
        version: FHIRVersion.FHIR_VERSION_R4,
      },
      humanReadableStr: "Medication request being analyzed.",
      aiSummary: "Request for blood pressure medication in review.",
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_UNSPECIFIED,
        createdTime: "2025-07-06T06:00:00Z",
        fetchTime: "2025-07-06T06:02:00Z",
        identifier: {
          key: "res-005",
          uid: "uid-005",
          patientId: "patient-005",
        },
        resourceType: "AllergyIntolerance",
        version: FHIRVersion.FHIR_VERSION_R4B,
      },
      humanReadableStr: "Allergy information unspecified.",
      aiSummary: undefined,
    },
  },
  {
    resource: {
      metadata: {
        state: ProcessingState.PROCESSING_STATE_COMPLETED,
        createdTime: "2025-07-05T05:00:00Z",
        fetchTime: "2025-07-05T05:05:00Z",
        processedTime: "2025-07-05T05:10:00Z",
        identifier: {
          key: "res-006",
          uid: "uid-006",
          patientId: "patient-006",
        },
        resourceType: "Encounter",
        version: FHIRVersion.FHIR_VERSION_UNSPECIFIED,
      },
      humanReadableStr: "Patient visited emergency room for chest pain.",
      aiSummary: "Possible cardiac condition flagged.",
    },
  },
];
