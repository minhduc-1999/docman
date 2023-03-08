import { Entity } from "./base/entity";

export enum InformationStatus {
  Cessation,
  Prosecution,
  NonProsecution,
}

export class ProcuracyInformation {
  procurator: string;
  designationNo: string;
  designatedAt: Date;
  additionalEvidenceRequirement: string;
  nonProsecutionDecision: string;
  cessationDecision: string;

  constructor(
    procurator: string,
    designationNo: string,
    designatedAt: Date,
    additionalEvidenceRequirement: string,
    nonProsecutionDecision: string,
    cessationDecision: string
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
  status: InformationStatus;
  handlingNo: string;
  handledAt: Date;
  transferredAt: Date;
  extendedAt: Date;
  recoveredAt: Date;
  canceledAt: Date;

  constructor(
    investigator: string,
    designationNo: string,
    designatedAt: Date,
    status: InformationStatus,
    handlingNo: string,
    handledAt: Date,
    transferredAt: Date,
    extendedAt: Date,
    recoveredAt: Date,
    canceledAt: Date
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
  description: string;
  law: string;

  investigationInformation: InvestigationBodyInformation;

  procuracyInformation: ProcuracyInformation;

  constructor(
    id: string,
    acceptanceNo: string,
    acceptedAt: Date,
    plaintiff: string,
    defendant: string,
    description: string,
    law: string,
    investigationInformation: InvestigationBodyInformation,
    procuracyInformation: ProcuracyInformation
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
