import { useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./storageUtility";

// TODO: remove once the TC retention follow-up APIs (save remarks, get-by-tc-id) are available on the backend.
// Until then the retention conversations live in session storage, keyed by TC request id, so the
// Transfer Certificate screen can be reviewed without a live backend.
export const TC_RETENTION_STORAGE_KEY = "tcRetentionFollowUps";

export interface ITcRetentionRemark {
  id: string;
  employeeName: string;
  createdAt: string;
  remarks: string;
  leavingReasonNames?: Array<string>;
  retentionStatusName?: string;
  retentionMeasureName?: string;
}

export interface ITcRetentionFollowUp {
  tcId: string;
  leavingReasonIds: Array<string>;
  retentionStatusId: string;
  nextFollowUpDate: string;
  isRetentionPossible: boolean;
  retentionMeasureId: string;
  /** Latest conversation first. */
  remarks: Array<ITcRetentionRemark>;
}

type FollowUpListener = (records: Array<ITcRetentionFollowUp>) => void;

const followUpListeners = new Set<FollowUpListener>();

function getTcRetentionFollowUps(): Array<ITcRetentionFollowUp> {
  try {
    const records = getSessionStorage(TC_RETENTION_STORAGE_KEY);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

/** Keeps a component re-rendering whenever a TC retention follow-up is saved in this session. */
export function useTcRetentionFollowUps() {
  const [followUps, setFollowUps] = useState<Array<ITcRetentionFollowUp>>(getTcRetentionFollowUps);

  useEffect(() => {
    setFollowUps(getTcRetentionFollowUps());
    followUpListeners.add(setFollowUps);
    return () => {
      followUpListeners.delete(setFollowUps);
    };
  }, []);

  return followUps;
}

export function getTcRetentionFollowUp(tcId?: string | number) {
  return getTcRetentionFollowUps().find((record) => `${record.tcId}` === `${tcId}`);
}

export function saveTcRetentionFollowUp(
  followUp: Omit<ITcRetentionFollowUp, "remarks">,
  remark: ITcRetentionRemark
) {
  const records = getTcRetentionFollowUps();
  const existingRemarks = records.find((record) => `${record.tcId}` === `${followUp.tcId}`)?.remarks || [];
  const updatedRecord: ITcRetentionFollowUp = {
    ...followUp,
    remarks: [remark, ...existingRemarks],
  };
  const updatedRecords = [
    updatedRecord,
    ...records.filter((record) => `${record.tcId}` !== `${followUp.tcId}`),
  ];
  setSessionStorage(TC_RETENTION_STORAGE_KEY, updatedRecords);
  followUpListeners.forEach((listener) => listener(updatedRecords));
  return updatedRecord;
}

// TODO: replace with the TC retention master APIs (Admissions > Settings) once they are available.
// Until then the masters live in session storage, seeded with the defaults below.
export type TcRetentionMasterType = "leavingReason" | "retentionStatus" | "retentionOfferType";

export interface ITcRetentionMaster {
  id: string;
  name: string;
  createdAt: string;
  /** Retention status only: a closing status ends the follow-up, so no next follow-up date is needed. */
  isClosure?: boolean;
}

export type TcRetentionMasterInput = Pick<ITcRetentionMaster, "name" | "isClosure">;

const TC_RETENTION_MASTER_STORAGE_KEYS: Record<TcRetentionMasterType, string> = {
  leavingReason: "tcLeavingReasons",
  retentionStatus: "tcRetentionStatuses",
  retentionOfferType: "tcRetentionOfferTypes",
};

const SEEDED_AT = "2026-09-01T10:00:00.000Z";

const defaultTcRetentionMasters: Record<TcRetentionMasterType, Array<ITcRetentionMaster>> = {
  leavingReason: [
    "Relocation / Parent Transfer",
    "Fee Affordability",
    "Dissatisfied with Academics",
    "Transport / Distance Issues",
    "Change of Curriculum / Board",
    "Admission in Another School",
    "Health / Personal Reasons",
    "Other",
  ].map((name, index) => ({ id: `${index + 1}`, name, createdAt: SEEDED_AT })),
  retentionStatus: [
    { name: "Counselling Scheduled", isClosure: false },
    { name: "Parent Reconsidering", isClosure: false },
    { name: "Parent Not Reachable", isClosure: false },
    { name: "Escalated to Principal", isClosure: false },
    { name: "Retained", isClosure: true },
    { name: "Leaving Confirmed", isClosure: true },
  ].map((item, index) => ({ id: `${index + 1}`, ...item, createdAt: SEEDED_AT })),
  retentionOfferType: [
    "Fee Concession / Installment Plan",
    "Transport Arrangement",
    "Section Change",
    "Academic Support / Remedial Classes",
    "Counselling with Principal",
    "Hostel Facility",
  ].map((name, index) => ({ id: `${index + 1}`, name, createdAt: SEEDED_AT })),
};

export function getTcRetentionMasters(type: TcRetentionMasterType): Array<ITcRetentionMaster> {
  try {
    const records = getSessionStorage(TC_RETENTION_MASTER_STORAGE_KEYS[type]);
    return Array.isArray(records) ? records : defaultTcRetentionMasters[type];
  } catch {
    return defaultTcRetentionMasters[type];
  }
}

function setTcRetentionMasters(type: TcRetentionMasterType, records: Array<ITcRetentionMaster>) {
  setSessionStorage(TC_RETENTION_MASTER_STORAGE_KEYS[type], records);
  return records;
}

export function addTcRetentionMasters(type: TcRetentionMasterType, items: Array<TcRetentionMasterInput>) {
  const createdAt = new Date().toISOString();
  const addedRecords = items.map((item, index) => ({
    id: `${Date.now()}-${index}`,
    name: item.name,
    createdAt,
    ...(type === "retentionStatus" ? { isClosure: !!item.isClosure } : {}),
  }));
  return setTcRetentionMasters(type, [...getTcRetentionMasters(type), ...addedRecords]);
}

export function updateTcRetentionMaster(type: TcRetentionMasterType, id: string, item: TcRetentionMasterInput) {
  return setTcRetentionMasters(
    type,
    getTcRetentionMasters(type).map((record) => (`${record.id}` === `${id}` ? { ...record, ...item } : record))
  );
}

export function deleteTcRetentionMaster(type: TcRetentionMasterType, id: string) {
  return setTcRetentionMasters(
    type,
    getTcRetentionMasters(type).filter((record) => `${record.id}` !== `${id}`)
  );
}

export interface ITcRetentionMasterLists {
  leavingReasons: Array<ITcRetentionMaster>;
  retentionStatuses: Array<ITcRetentionMaster>;
  retentionOfferTypes: Array<ITcRetentionMaster>;
}

export function getTcRetentionMasterLists(): ITcRetentionMasterLists {
  return {
    leavingReasons: getTcRetentionMasters("leavingReason"),
    retentionStatuses: getTcRetentionMasters("retentionStatus"),
    retentionOfferTypes: getTcRetentionMasters("retentionOfferType"),
  };
}

export interface ITcRetentionSummary {
  leavingReasonNames: Array<string>;
  retentionStatusName?: string;
  retentionOfferTypeName?: string;
}

/**
 * Latest retention values of a TC request, named from the current masters. A master deleted in
 * Settings falls back to the name recorded with the latest remark.
 */
export function getTcRetentionSummary(
  followUp: ITcRetentionFollowUp,
  masters: ITcRetentionMasterLists
): ITcRetentionSummary {
  const latestRemark = followUp.remarks?.[0];
  const findName = (records: Array<ITcRetentionMaster>, id?: string) =>
    records.find((record) => `${record.id}` === `${id}`)?.name;
  const leavingReasonNames = (followUp.leavingReasonIds || []).map((id) => findName(masters.leavingReasons, id));
  return {
    leavingReasonNames: leavingReasonNames.every(Boolean)
      ? (leavingReasonNames as Array<string>)
      : latestRemark?.leavingReasonNames || [],
    retentionStatusName:
      findName(masters.retentionStatuses, followUp.retentionStatusId) || latestRemark?.retentionStatusName,
    retentionOfferTypeName: followUp.isRetentionPossible
      ? findName(masters.retentionOfferTypes, followUp.retentionMeasureId) || latestRemark?.retentionMeasureName
      : undefined,
  };
}
