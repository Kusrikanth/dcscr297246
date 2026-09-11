import { HugeiconsIcon } from "@hugeicons/react";
import {
  StudentsIcon,
  UserGroup03Icon,
  ValidationApprovalIcon,
} from "@hugeicons-pro/core-stroke-standard";
import DetailCard from "./StatsCard";
import { useEffect, useMemo, useState } from "react";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getSchoolStrengthStatsAct, getSchoolStrengthStatsCountAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import StudentCountModal from "../../../UpdatedDashboard/SchoolStrengthTab/Statistics/StudentCountModal";
import TotalInactiveModal from "../../../UpdatedDashboard/SchoolStrengthTab/Statistics/TotalInactiveModal";
import NewAdmissionsModal from "../../../UpdatedDashboard/SchoolStrengthTab/Statistics/NewAdmissionsModal";
import TotalParentsModal from "../../../UpdatedDashboard/SchoolStrengthTab/Statistics/TotalParentsModal";

const numbers = ["One", "Two", "Three"]

const getTypeName = (id : string) => {
  switch (id) {
    case "studentCountModal":
      return "STUDENTS COUNT";
    case "totalInactiveModal":
      return "TOTAL INACTIVE";
    case "newAdmissionsModal":
      return "NEW ADMISSIONS";
    case "totalParentsModal":
      return "TOTAL PARENTS";
    default:
      return "";
  }
}

export const detailCardsData = [
  {
    id: "studentCountModal",
    keyName: "studentsCount",
    bgColor: "#E1E2F6",
    cardTitle: "Student count",
    cardCount: "900",
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    cardIcon: <HugeiconsIcon icon={StudentsIcon} size={26} color={"#000000"} />,
    overlayColor: "#B0B2D4",
    overlayChildColor: "#CACBF0",
  },
  {
    id: "newAdmissionsModal",
    keyName: "newAdmissions",
    bgColor: "#EFF7E2",
    cardTitle: "New Admissions",
    cardCount: "50",
    cardIcon: <HugeiconsIcon icon={StudentsIcon} size={26} color={"#000000"} />,
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    overlayColor: "#C7D3B2",
    overlayChildColor: "#DDEABA",
  },
  {
    id: "totalParentsModal",
    keyName: "totalParents",
    bgColor: "#ebeedf",
    cardTitle: "Total Parents",
    cardCount: "100",
    cardIcon: (
      <HugeiconsIcon
        icon={ValidationApprovalIcon}
        size={26}
        color={"#000000"}
      />
    ),
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    overlayColor: "#C1C4A8",
    overlayChildColor: "#D4D7C3",
  },
  {
    id: "totalInactiveModal",
    keyName: "totalInactive",
    bgColor: "#F8EFE2",
    cardTitle: "Total Inactive",
    cardCount: "200",
    cardIcon: (
      <HugeiconsIcon icon={UserGroup03Icon} size={24} color={"#000000"} />
    ),
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    overlayColor: "#D7C5A9",
    overlayChildColor: "#EDE0C8",
  },
];

const SchoolStrengthStatistics = () => {
  const dispatch = useAppDispatch();
  const [academicYearId, setAcademicYearId] = useState('');
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getSchoolStrengthStatsResp,academicYearListResp
  } = useAppSelector(
    ({ instAcademics, appData, reports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSchoolStrengthStatsResp: reports.getSchoolStrengthStatsResp,
      academicYearListResp: instAcademics.academicYearListResp,

    }),
    shallowEqual
  );

  const [modalStates, setModalStates] = useState({
    studentCountModal: false,
    totalInactiveModal: false,
    newAdmissionsModal: false,
    totalParentsModal: false,
  });

  const openModal = (modalId: string) => {
    schoolStrengthStatsStuCountApiCall({ type: getTypeName(modalId) })
    setModalStates((prev) => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModalStates((prev) => ({ ...prev, [modalId]: false }));
  };

  const schoolStrengthStatsStuCountApiCall = (otherProps?: any) => {
    const payload = {
      instituteId,
      academicYearId,
      ...otherProps,

    };
    if (academicYearId) {
      dispatch(getSchoolStrengthStatsCountAct(generateActionPayload('get_school_strength_stats_count', undefined, payload)))
    }
  }

  const schoolStrengthStatsApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getSchoolStrengthStatsAct(generateActionPayload('get_school_strength_stats', undefined, payload)))
  }

  useEffect(() => {
  if (branchId || academicYearListResp) {
    if (academicYearListResp && academicYearListResp.data && academicYearListResp.data.length > 0) {
      const { academicYearId } = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      schoolStrengthStatsApiCall({ academicYearId })
      setAcademicYearId(academicYearId || '')
    }
  }
}, [branchId, academicYearListResp])

  const cardData = useMemo(() => {
    if (getSchoolStrengthStatsResp) {
      const newData = detailCardsData.map((item: any) => {
        const curr = getSchoolStrengthStatsResp[item.keyName]
        let totalCount: number = 0
        let data: any;
        if (item.keyName === "newAdmissions") {
          totalCount = curr?.reduce((acc: any, cur: any) => acc + cur?.studentsCount || 0, 0)
          data = curr?.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: i?.studentsCount || 0, [`subText${numbers[idx]}`]: i?.curriculumName }
          })
        } else if (item.keyName === "studentsCount") {
          totalCount = curr?.reduce((acc: any, cur: any) => acc + cur?.studentsCount || 0, 0)
          data = curr?.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: i?.studentsCount || 0, [`subText${numbers[idx]}`]: i?.curriculumName }
          })
        } else if (item.keyName === "totalInactive") {
          const arr = ["tcRequests", "tcIssued", "notReporting"]
          totalCount = curr?.totalInactive || 0
          data = arr.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: curr[i] || 0, [`subText${numbers[idx]}`]: i }
          })
        } else if (item.keyName === "totalParents") {
          const arr = ["staffParents", "eliteParents", "others"]
          totalCount = curr?.totalParents || 0
          data = arr.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: curr[i] || 0, [`subText${numbers[idx]}`]: i }
          })
        }
        const newData = data?.reduce((ac: any, cur: any) => ac = { ...ac, ...cur }, {})
        return {
          ...item,
          cardCount: totalCount || 0,
          ...newData
        }
      })
      return newData
    }
  }, [getSchoolStrengthStatsResp])

  return (
    <>
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 tw-gap-6 tw-w-full transports-statistics-container">

        {(Array.isArray(cardData) ? cardData : []).map((item: any, index: number) => (

          <div key={index} className="tw-w-full">
            <DetailCard
              cardTitle={item.cardTitle}
              cardCount={item.cardCount}
              iconBgColor={item.iconBgColor}
              iconColor={item.iconColor}
              cardIcon={item.cardIcon}
              bgColor={item.bgColor}
              subTextOne={item.subTextOne}
              subTextTwo={item.subTextTwo}
              subTextThree={item.subTextThree}
              subCountOne={item.subCountOne}
              subCountTwo={item.subCountTwo}
              subCountThree={item.subCountThree}
              overlayColor={item.overlayColor}
              overlayChildColor={item.overlayChildColor}
              openModal={() => openModal(item.id)}
            />
          </div>

        ))}
      </div>

      <ModalContainerUpdated
        id="studentCountModal"
        isOpen={modalStates.studentCountModal}
        toggle={() => closeModal("studentCountModal")}
        modalTitle="Student Count"
        modalSize="lg"
      >
        <StudentCountModal
          toggle={() => closeModal("studentCountModal")}
          academicYearId
        ></StudentCountModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="totalInactiveModal"
        isOpen={modalStates.totalInactiveModal}
        toggle={() => closeModal("totalInactiveModal")}
        modalTitle="Total Inactive"
        modalSize="lg"
      >
        <TotalInactiveModal
          toggle={() => closeModal("totalInactiveModal")}
          academicYearId
        ></TotalInactiveModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="newAdmissionsModal"
        isOpen={modalStates.newAdmissionsModal}
        toggle={() => closeModal("newAdmissionsModal")}
        modalTitle="New Admissions"
        modalSize="lg"
      >
        <NewAdmissionsModal
          toggle={() => closeModal("newAdmissionsModal")}
          academicYearId
        ></NewAdmissionsModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="totalParentsModal"
        isOpen={modalStates.totalParentsModal}
        toggle={() => closeModal("totalParentsModal")}
        modalTitle="Total Parents"
        modalSize="lg"
      >
        <TotalParentsModal
          toggle={() => closeModal("totalParentsModal")}
          academicYearId
        ></TotalParentsModal>
      </ModalContainerUpdated>
    </>
  );
};

export default SchoolStrengthStatistics;
