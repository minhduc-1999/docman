import { Information } from "@/models/information";
import { invoke } from "@tauri-apps/api/tauri";

export async function addNewCriminalInformation(information: Information) {
  return invoke("create_information", {
    information: {
      acceptance_no: information.acceptanceNo,
      accepted_at: information.acceptedAt.getSeconds(),
      plaintiff: information.plaintiff,
      defendant: information.defendant,
      description: information.description,
      law: information.law,
      inv_investigator: information.investigationInformation?.investigator,
      inv_designation_no: information.investigationInformation?.designationNo,
      inv_designated_at:
        information.investigationInformation?.designatedAt.getSeconds(),
      inv_status: information.investigationInformation?.status,
      inv_handling_no: information.investigationInformation?.handlingNo,
      inv_handled_at:
        information.investigationInformation?.handledAt?.getSeconds(),
      inv_transferred_at:
        information.investigationInformation?.transferredAt?.getSeconds(),
      inv_extended_at:
        information.investigationInformation?.extendedAt?.getSeconds(),
      inv_recovered_at:
        information.investigationInformation?.recoveredAt?.getSeconds(),
      inv_canceled_at:
        information.investigationInformation?.canceledAt?.getSeconds(),
      //Prosecution
      pro_procurator: information.procuracyInformation?.procurator,
      pro_designation_no: information.procuracyInformation?.designationNo,
      pro_designated_at:
        information.procuracyInformation?.designatedAt.getSeconds(),
      pro_additional_evidence_requirement:
        information.procuracyInformation?.additionalEvidenceRequirement,
      pro_non_prosecution_decision:
        information.procuracyInformation?.nonProsecutionDecision,
      pro_cessation_decision:
        information.procuracyInformation?.cessationDecision,
    },
  });
}
