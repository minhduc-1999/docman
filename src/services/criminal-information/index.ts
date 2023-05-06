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

export async function updateInformation(information: Information) {
  return invoke("update_information", {
    information: {
      id: information.id,
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

export enum Order {
  DESC = "DESC",
  ASC = "ASC",
}

export type QueryOption = {
  offset: number;
  limit: number;
  order: Order;
  search: string | null;
};

export async function getInformationList(
  queryOption: QueryOption
): Promise<[Information[], number]> {
  const result: [any[], number] = await invoke("get_information_list", {
    queryOpt: queryOption,
  });
  const listInformation = result[0].map((item) => {
    let investigationInfor: InvestigationBodyInformation | null = null;
    let prosecutionInfor: ProcuracyInformation | null = null;
    if (item.inv_investigator && item.inv_designation_no) {
      investigationInfor = new InvestigationBodyInformation(
        item.inv_investigator,
        item.inv_designation_no,
        new Date(item.inv_designated_at),
        item.inv_status,
        item.inv_handled_at ? new Date(item.inv_handled_at) : null,
        item.inv_transferred_at ? new Date(item.inv_transferred_at) : null,
        item.inv_handling_no,
        item.inv_extended_at ? new Date(item.inv_extended_at) : null,
        item.inv_recovered_at ? new Date(item.inv_recovered_at) : null,
        item.inv_canceled_at ? new Date(item.inv_canceled_at) : null
      );
    }
    if (item.pro_procurator && item.pro_designation_no)
      prosecutionInfor = new ProcuracyInformation(
        item.pro_procurator,
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
      investigationInfor,
      prosecutionInfor
    );
  });
  return [listInformation, listInformation.length > 0 ? result[1] : 0];
}

export async function getNewInformationList(
  queryOption: QueryOption
): Promise<[Information[], number]> {
  const result: [any[], number] = await invoke("get_new_information_list", {
    queryOpt: queryOption,
  });
  const listInformation = result[0].map((item) => {
    let investigationInfor: InvestigationBodyInformation | null = null;
    let prosecutionInfor: ProcuracyInformation | null = null;
    if (item.int_investigator && item.inv_designation_no)
      investigationInfor = new InvestigationBodyInformation(
        item.int_investigator,
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
    if (item.pro_procurator && item.pro_designation_no)
      prosecutionInfor = new ProcuracyInformation(
        item.pro_procurator,
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
      investigationInfor,
      prosecutionInfor
    );
  });
  return [listInformation, listInformation.length > 0 ? result[1] : 0];
}

export async function deleteInformation(ids: string[]): Promise<void> {
  await invoke("delete_information", {
    ids: ids.map((id) => id.toString()),
  });
}

export type SummarySetting = {
  from: Date;
  to: Date;
  path: string;
};

export async function exportExcel(setting: SummarySetting): Promise<string> {
  const { from, to, path } = setting;
  return invoke("export_excel", {
    setting: {
      from: from.getTime(),
      to: to.getTime(),
      path,
    },
  });
}
