import {
  Information,
  InvestigationBodyInformation,
  ProcuracyInformation,
} from "@/models/information";
import { invoke } from "@tauri-apps/api/tauri";

export async function addNewCriminalInformation(information: Information) {
  return invoke("create_information", {
    information: {
      id: 0, // Seed ID
      acceptance_no: information.acceptanceNo,
      accepted_at: information.acceptedAt.getTime(),
      plaintiff: information.plaintiff,
      defendant: information.defendant,
      description: information.description,
      law: information.law,
      inv_investigator: information.investigationInformation?.investigator,
      inv_designation_no: information.investigationInformation?.designationNo,
      inv_designated_at:
        information.investigationInformation?.designatedAt.getTime(),
      inv_status: information.investigationInformation?.status,
      inv_handling_no: information.investigationInformation?.handlingNo,
      inv_handled_at:
        information.investigationInformation?.handledAt?.getTime(),
      inv_transferred_at:
        information.investigationInformation?.transferredAt?.getTime(),
      inv_extended_at:
        information.investigationInformation?.extendedAt?.getTime(),
      inv_recovered_at:
        information.investigationInformation?.recoveredAt?.getTime(),
      inv_canceled_at:
        information.investigationInformation?.canceledAt?.getTime(),
      //Prosecution
      pro_procurator: information.procuracyInformation?.procurator,
      pro_designation_no: information.procuracyInformation?.designationNo,
      pro_designated_at:
        information.procuracyInformation?.designatedAt.getTime(),
      pro_additional_evidence_requirement:
        information.procuracyInformation?.additionalEvidenceRequirement,
      pro_non_prosecution_decision:
        information.procuracyInformation?.nonProsecutionDecision,
      pro_cessation_decision:
        information.procuracyInformation?.cessationDecision,
    },
  });
}

enum Order {
  DESC = "DESC",
  ASC = "ASC",
}

export class QueryOption {
  offset: number = 0;
  limit: number = 10;
  order: Order = Order.ASC;
}

export async function getInformationList(
  queryOption: QueryOption
): Promise<Information[]> {
  const rawList: any[] = await invoke("get_information_list", {
    queryOpt: queryOption,
  });
  return rawList.map((item) => {
    let investigationInfor: InvestigationBodyInformation | null = null;
    let prosecutionInfor: ProcuracyInformation | null = null;
    if (item.investigator && item.inv_designation_no)
      investigationInfor = new InvestigationBodyInformation(
        item.investigator,
        item.inv_designation_no,
        new Date(item.inv_designated_at),
        item.inv_status,
        item.inv_handled_at && new Date(item.inv_handled_at),
        item.inv_transferred_at && new Date(item.inv_transferred_at),
        item.inv_handling_no,
        item.inv_extended_at && new Date(item.inv_extended_at),
        item.inv_recovered_at && new Date(item.inv_recovered_at),
        item.inv_canceled_at && new Date(item.inv_canceled_at)
      );
    if (item.procurator && item.pro_designation_no)
      prosecutionInfor = new ProcuracyInformation(
        item.procurator,
        item.pro_designation_no,
        new Date(item.pro_designated_at),
        item.pro_additional_evidence_requirement,
        item.pro_non_prosecution_decision,
        item.pro_cessation_decision
      );

    return new Information(
      item.id,
      item.acceptance_no,
      item.plaintiff,
      item.defendant,
      new Date(item.accepted_at),
      item.law,
      item.description,
      item.investigation_infor,
      item.prosecution_infor
    );
  });
}
