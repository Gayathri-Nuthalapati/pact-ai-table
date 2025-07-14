export interface EHRResourceIdentifier {
  key: string;
  uid: string;
  patientId: string;
}

export enum ProcessingState {
  PROCESSING_STATE_UNSPECIFIED = "PROCESSING_STATE_UNSPECIFIED",
  PROCESSING_STATE_NOT_STARTED = "PROCESSING_STATE_NOT_STARTED",
  PROCESSING_STATE_PROCESSING = "PROCESSING_STATE_PROCESSING",
  PROCESSING_STATE_COMPLETED = "PROCESSING_STATE_COMPLETED",
  PROCESSING_STATE_FAILED = "PROCESSING_STATE_FAILED",
}

export enum FHIRVersion {
  FHIR_VERSION_UNSPECIFIED = "FHIR_VERSION_UNSPECIFIED",
  FHIR_VERSION_R4 = "FHIR_VERSION_R4",
  FHIR_VERSION_R4B = "FHIR_VERSION_R4B",
}

export interface EHRResourceMetadata {
  state: ProcessingState;
  createdTime: string;
  fetchTime: string;
  processedTime?: string;
  identifier: EHRResourceIdentifier;
  resourceType: string;
  version: FHIRVersion;
}

export interface EHRResourceJson {
  metadata: EHRResourceMetadata;
  humanReadableStr: string;
  aiSummary?: string;
}

export interface ResourceWrapper {
  resource: EHRResourceJson;
}
