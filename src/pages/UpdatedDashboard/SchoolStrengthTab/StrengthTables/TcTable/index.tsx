import { useEffect, useMemo, useState } from "react";
import { ModalContainerUpdated, SelectInput, TableExpandable } from "../../../../../Components/Common";
import { generateColumns, tcFilers } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import ShowStudents from "../ShowStudents";
import { useModal } from "../../../../../hooks/modalhook";

const TcTable = ({academicYearId , tcStatus }: any) => {
  const [totalBranches, setTotalBranches] = useState<any[]>([]);
  const { closeModal, modalState, openModal } = useModal()

  const { getClassByBranchStatusResp } =
    useAppSelector(({ reports }) => ({
      getClassByBranchStatusResp: reports.getClassByBranchStatusResp,
    }), shallowEqual)

  const tableData = useMemo(() => {
    if (Array.isArray(getClassByBranchStatusResp) && getClassByBranchStatusResp.length > 0) {
      return Object.values(
        getClassByBranchStatusResp?.reduce((acc: any, curr: any) => {
          const {
            className,
            shortName,
            branchName,
            curriculumName,
            studentsCount,
          } = curr;

          const key = shortName;

          const curriculumKey = curriculumName?.includes("CBSE") ? "CBSE" : curriculumName?.includes("CAMBRIDGE") ? "IGCSE" : "EY";

          const branchKey = branchName?.toLowerCase()?.replace(/\s+/g, '');

          if (!acc[key]) {
            acc[key] = {
              className: shortName,
            };
          }

          const branchCurriculumKey = `${branchKey}${curriculumKey}`;
          acc[key][branchCurriculumKey] = (acc[key][branchCurriculumKey] || 0) + studentsCount;

          const branchTotalKey = `${branchKey}Total`;
          acc[key][branchTotalKey] = (acc[key][branchTotalKey] || 0) + studentsCount;

          return acc;
        }, {})
      );
    }
    return []
  }, [getClassByBranchStatusResp]);

  useEffect(() => {
    if (getClassByBranchStatusResp) {
      setTotalBranches(Array.from(
        new Map(
          getClassByBranchStatusResp.map((item: any) => [item.branchName, { branchName: item.branchName, branchId: item.branchId }])
        ).values()
      ));
    }
  }, [getClassByBranchStatusResp])

  const tableColumns = useMemo(() => generateColumns(totalBranches,openModal), [totalBranches, tableData]);

  return (
    <div className="">
      <TableExpandable
        columns={tableColumns || []}
        data={tableData || []}
        divClass="table-responsive tw-mb-3 table-expandable table-sticky marks-range-table-container"
        theadClass="text-muted tw-align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="tw-font-semibold bg-light"
      ></TableExpandable>
      <ModalContainerUpdated
        id="curriculum-wise-strength-modal"
        isOpen={modalState.showModal}
        toggle={() => closeModal()}
        modalTitle="TC Wise Students Record"
        modalSize="lg"
      >
        <ShowStudents
          modalData={modalState.modalData}
          toggle={() => closeModal()}
          filterValues={{ ...modalState.modalData, academicYearId , tcStatus }}
        ></ShowStudents>
      </ModalContainerUpdated>
    </div>
  );
};

export default TcTable;
