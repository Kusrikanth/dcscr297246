import { useEffect, useMemo, useState } from "react";
import { ModalContainerUpdated, TableExpandable } from "../../../../../Components/Common";
import { generateColumns } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useModal } from "../../../../../hooks/modalhook";
import ShowStudents from "../ShowStudents";

const GenderWiseStrengthExpand = ({ academicYearId }: any) => {

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
            genderName,
            studentsCount,
          } = curr;

          const key = shortName;

          const genderKey = genderName === ("MALE") ? "Boys" : genderName === ("FEMALE") ? "Girls" : "Others";

          const branchKey = branchName?.toLowerCase()?.replace(/\s+/g, '');

          if (!acc[key]) {
            acc[key] = {
              className: shortName,
            };
          }

          const branchGenderKey = `${branchKey}${genderKey}`;
          acc[key][branchGenderKey] = (acc[key][branchGenderKey] || 0) + studentsCount;

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

  const tableColumns = useMemo(() => {
    if (!Array.isArray(totalBranches) || totalBranches.length === 0) return [];
    return generateColumns(totalBranches, openModal)
  }, [totalBranches, tableData]);

  return (
    <div className="">
      <TableExpandable
        columns={tableColumns || []}
        data={Array.isArray(tableData) ? tableData : []}
        divClass="table-responsive mb-3 table-expandable table-sticky marks-range-table-container"
        theadClass="text-muted align-middle theadPrimary"
        tableClass="table-bordered table-nowrap"
        showFooter={true}
        trFooterClass="fw-semibold bg-light"
      ></TableExpandable>
      <ModalContainerUpdated
        id="gender-wise-strength-modal"
        isOpen={modalState.showModal}
        toggle={() => closeModal()}
        modalTitle="Gender Wise Students Record"
        modalSize="lg"
      >
        <ShowStudents
          modalData={modalState.modalData}
          toggle={() => closeModal()}
          filterValues={{ ...modalState.modalData, academicYearId, }}
        ></ShowStudents>
      </ModalContainerUpdated>
    </div>
  );
};

export default GenderWiseStrengthExpand;
