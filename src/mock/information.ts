import {
  Information,
  InformationStatus,
  InvestigationBodyInformation,
  ProcuracyInformation,
} from "@/models/information";
export async function createInformation(): Promise<Information> {
  return new Information(
    "DOC01",
    "NO1",
    new Date(),
    "Nguyen Van A",
    "Dinh Thi B",
    "Mo ta",
    "L001",
    new InvestigationBodyInformation(
      "Tran A",
      "INO1",
      new Date(),
      InformationStatus.Cessation,
      "HAND1",
      new Date(),
      new Date(),
      new Date(),
      new Date(),
      new Date()
    ),
    new ProcuracyInformation(
      "Dinh B",
      "DE01",
      new Date(),
      "Yeu cau them chung cu",
      "Khong khoi to vu an",
      "Tam dinh chi vu an"
    )
  );
}
