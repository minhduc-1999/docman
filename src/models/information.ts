import { Entity } from "./base/entity";

export enum InformationStatus {
  None,
  Cessation,
  Prosecution,
  NonProsecution,
}

export class ProcuracyInformation {
  procurator: string;
  designationNo: string;
  designatedAt: Date;
  additionalEvidenceRequirement: null | string;
  nonProsecutionDecision: null | string;
  cessationDecision: null | string;

  constructor(
    procurator: string,
    designationNo: string,
    designatedAt: Date,
    additionalEvidenceRequirement: null | string,
    nonProsecutionDecision: null | string,
    cessationDecision: null | string
  ) {
    this.procurator = procurator;
    this.designationNo = designationNo;
    this.designatedAt = designatedAt;
    this.additionalEvidenceRequirement = additionalEvidenceRequirement;
    this.nonProsecutionDecision = nonProsecutionDecision;
    this.cessationDecision = cessationDecision;
  }
}

export class InvestigationBodyInformation {
  investigator: string;
  designationNo: string;
  designatedAt: Date;
  status: InformationStatus | null;
  handlingNo: string | null;
  handledAt: Date | null;
  transferredAt: Date | null;
  extendedAt: Date | null;
  recoveredAt: null | Date;
  canceledAt: null | Date;

  constructor(
    investigator: string,
    designationNo: string,
    designatedAt: Date,
    status: null | InformationStatus,
    handledAt: null | Date,
    transferredAt: null | Date,
    handlingNo: null | string,
    extendedAt: null | Date,
    recoveredAt: null | Date,
    canceledAt: null | Date
  ) {
    this.investigator = investigator;
    this.designationNo = designationNo;
    this.designatedAt = designatedAt;
    this.status = status;
    this.handlingNo = handlingNo;
    this.handledAt = handledAt;
    this.transferredAt = transferredAt;
    this.extendedAt = extendedAt;
    this.recoveredAt = recoveredAt;
    this.canceledAt = canceledAt;
  }
}

export class Information extends Entity {
  acceptanceNo: string;
  acceptedAt: Date;
  plaintiff: string;
  defendant: string;
  description: null | string;
  law: null | string;

  investigationInformation: null | InvestigationBodyInformation;

  procuracyInformation: null | ProcuracyInformation;

  constructor(
    id: string,
    acceptanceNo: string,
    plaintiff: string,
    defendant: string,
    acceptedAt: Date,
    law: null | string,
    description: null | string,
    investigationInformation: null | InvestigationBodyInformation,
    procuracyInformation: null | ProcuracyInformation
  ) {
    super(id);
    this.acceptanceNo = acceptanceNo;
    this.acceptedAt = acceptedAt;
    this.plaintiff = plaintiff;
    this.defendant = defendant;
    this.description = description;
    this.law = law;
    this.investigationInformation = investigationInformation;
    this.procuracyInformation = procuracyInformation;
  }
}
