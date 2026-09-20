import { useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./storageUtility";

// TODO: remove once the "revert TC to previous academic year" API is available on the backend.
// Until then the reverted records live in session storage so the Transfer Certificate screen and
// the Fee > Transfer Request Approvals screen stay in sync without a live backend.
export const TC_REVERT_STORAGE_KEY = "revertedTcRequests";

export interface IRevertedTcRecord {
  tcId: string;
  tcNumber?: string;
  studentId?: string;
  studentCode?: string;
  studentName?: string;
  curriculumName?: string;
  className?: string;
  sectionName?: string;
  requestType?: string;
  tcApplicationDate?: string;
  lastAttendanceDate?: string;
  /** Academic year the request was raised in, the one the ledgers were removed from. */
  fromAcademicYearId: string;
  fromAcademicYearName: string;
  /** Academic year the request now belongs to. */
  revertedAcademicYearId: string;
  revertedAcademicYearName: string;
  deletedLedgerCount?: number;
  revertRemarks?: string;
  revertedAt: string;
}

type RevertListener = (records: Array<IRevertedTcRecord>) => void;

const revertListeners = new Set<RevertListener>();

export function getRevertedTcRecords(): Array<IRevertedTcRecord> {
  try {
    const records = getSessionStorage(TC_REVERT_STORAGE_KEY);
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function notifyRevertListeners(records: Array<IRevertedTcRecord>) {
  revertListeners.forEach((listener) => listener(records));
}

export function addRevertedTcRecord(record: IRevertedTcRecord) {
  const records = getRevertedTcRecords().filter(
    (item) => `${item.tcId}` !== `${record.tcId}`
  );
  const updatedRecords = [record, ...records];
  setSessionStorage(TC_REVERT_STORAGE_KEY, updatedRecords);
  notifyRevertListeners(updatedRecords);
  return updatedRecords;
}

export function clearRevertedTcRecords() {
  setSessionStorage(TC_REVERT_STORAGE_KEY, []);
  notifyRevertListeners([]);
}

export function subscribeToRevertedTcRecords(listener: RevertListener) {
  revertListeners.add(listener);
  return () => {
    revertListeners.delete(listener);
  };
}

/** Keeps a component re-rendering whenever a TC request is reverted in this session. */
export function useRevertedTcRecords() {
  const [revertedRecords, setRevertedRecords] = useState<Array<IRevertedTcRecord>>(
    getRevertedTcRecords
  );

  useEffect(() => {
    setRevertedRecords(getRevertedTcRecords());
    return subscribeToRevertedTcRecords(setRevertedRecords);
  }, []);

  return revertedRecords;
}

/** Start year of "2026-2027" / "2026-27" / "2026 - 27". */
export function getAcademicYearStart(academicYearName?: string) {
  const [startYear] = `${academicYearName || ""}`.match(/\d{4}/) || [];
  return startYear ? +startYear : undefined;
}

/**
 * Resolves the academic year immediately before the given one, preferring an exact
 * start-year match and falling back to the next entry in a descending year list.
 */
export function getPreviousAcademicYear(
  academicYearList: Array<any> | undefined,
  academicYearId: string
) {
  if (!Array.isArray(academicYearList) || !academicYearId) {
    return undefined;
  }
  const currentYear = academicYearList.find(
    (year: any) => `${year?.academicYearId}` === `${academicYearId}`
  );
  const currentStart = getAcademicYearStart(currentYear?.academicYearName);
  if (currentStart) {
    const previousYear = academicYearList.find(
      (year: any) => getAcademicYearStart(year?.academicYearName) === currentStart - 1
    );
    if (previousYear) {
      return previousYear;
    }
  }
  const sortedYears = [...academicYearList].sort(
    (a: any, b: any) =>
      (getAcademicYearStart(b?.academicYearName) || 0) -
      (getAcademicYearStart(a?.academicYearName) || 0)
  );
  const currentIndex = sortedYears.findIndex(
    (year: any) => `${year?.academicYearId}` === `${academicYearId}`
  );
  return currentIndex > -1 ? sortedYears[currentIndex + 1] : undefined;
}
