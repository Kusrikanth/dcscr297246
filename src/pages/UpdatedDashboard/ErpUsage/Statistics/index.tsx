import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple03Icon,
  LoginMethodIcon,
  TeacherIcon,
  UnavailableIcon,
} from "@hugeicons-pro/core-stroke-standard";
import DetailCard from "./StatsCard";
import { useEffect, useMemo, useState } from "react";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getErpUsageStatsAct, getErpUsageStatsHyperlinkAct, getSchoolStrengthStatsAct, getSchoolStrengthStatsCountAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import StatsCount from "./StatsCount";

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
  // {
  //   id: "totalLoginsModal",
  //   keyName: "studentsCount",
  //   bgColor: "#E1E2F6",
  //   cardTitle: "Total Logins",
  //   cardCount: "900",
  //   iconBgColor: "bg-soft-info",
  //   iconColor: "text-info",
  //   cardIcon: <HugeiconsIcon icon={LoginMethodIcon} size={26} color={"#000000"} />,
  //   overlayColor: "#B0B2D4",
  //   overlayChildColor: "#CACBF0",
  //   subTextOne : "Parent",
  //   subTextTwo : "Students",
  //   subTextThree : "Staff",
  //   subCountOne : "10",
  //   subCountTwo : "20",
  //   subCountThree : "30",
  // },
  {
    id: "parentLoginsModal",
    keyName: "Parent Logins",
    bgColor: "#EFF7E2",
    cardTitle: "Parent Logins",
    cardCount: "50",
    cardIcon: <HugeiconsIcon icon={UserMultiple03Icon} size={26} color={"#000000"} />,
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    overlayColor: "#C7D3B2",
    overlayChildColor: "#DDEABA",
  },
  {
    id: "staffLoginsModal",
    keyName: "Staff Logins",
    bgColor: "#ebeedf",
    cardTitle: "Staff Logins",
    cardCount: "100",
    cardIcon: (
      <HugeiconsIcon
        icon={TeacherIcon}
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
    id: "notLoginInfoModal",
    keyName: "Not Login Info",
    bgColor: "#F8EFE2",
    cardTitle: "Not Login Info",
    cardCount: "200",
    cardIcon: (
      <HugeiconsIcon icon={UnavailableIcon} size={24} color={"#000000"} />
    ),
    iconBgColor: "bg-soft-info",
    iconColor: "text-info",
    overlayColor: "#D7C5A9",
    overlayChildColor: "#EDE0C8",
  },
];

const ErpUsageStatistics = (props: any) => {
  const dispatch = useAppDispatch();
  const { branchId, academicYearId } = props || {}

  const { currentBranchIdResp, currentInstIdResp: instituteId,
    getErpUsageStatsResp, getErpUsageStatsHyperlinkResp
  } = useAppSelector(
    ({ instAcademics, appData, reports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getErpUsageStatsResp: reports.getErpUsageStatsResp,
      getErpUsageStatsHyperlinkResp: reports.getErpUsageStatsHyperlinkResp
    }),
    shallowEqual
  );

  const [modalStates, setModalStates] = useState({
    parentLoginsModal: false,
    staffLoginsModal: false,
    notLoginInfoModal: false,
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
    // dispatch(getSchoolStrengthStatsCountAct(generateActionPayload('get_school_strength_stats_count', undefined, payload)))
  }

  const schoolStrengthStatsApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getErpUsageStatsAct(generateActionPayload('get_erp_usage_stats', undefined, payload)))
  }
  const schoolStrengthStatsHyperlinkApiCall = (otherProps?: any) => {
    const payload = {
      instituteId, 
      academicYearId,
    };
    dispatch(getErpUsageStatsHyperlinkAct(generateActionPayload('get_erp_usage_stats_hyperlink', undefined, payload)))
  }

  useEffect(() => {
    if (branchId || academicYearId) {
      schoolStrengthStatsApiCall()
    }
  }, [branchId, academicYearId])

   useEffect(() => {
    if (academicYearId) {
      schoolStrengthStatsHyperlinkApiCall();
    }
  },[academicYearId])

  const cardData = useMemo(() => {
    if (getErpUsageStatsResp) {
      const newData = detailCardsData.map((item: any) => {
        const curr = getErpUsageStatsResp[item.keyName]
        let totalCount: number = 0
        let data: any;
        const arr = [
          {key : "todayLogins", name : "Today Logins"},
          {key : "weekLogins", name : "Week Logins"},
          {key : "monthLogins", name : "Month Logins"},
        ]
        if (item.keyName === "Not Login Info") {
          totalCount = curr?.reduce((acc: any, cur: any) => acc + cur?.count || 0, 0)
          data = curr?.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: i?.count || "0", [`subText${numbers[idx]}`]: i?.userType }
          })
        } else if (item.keyName === "Parent Logins") {
          totalCount = curr?.totalCount || 0
          data = arr.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: curr?.[i?.key] || "0", [`subText${numbers[idx]}`]: i?.name }
          })
        } else if (item.keyName === "Staff Logins") {
          totalCount = curr?.totalCount || 0
          data = arr.map((i: any, idx: number) => {
            return { [`subCount${numbers[idx]}`]: curr?.[i?.key] || "0", [`subText${numbers[idx]}`]: i?.name }
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
  }, [getErpUsageStatsResp])

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-rounded-xl transports-statistics-container">
        {(Array.isArray(cardData) ? cardData : [])?.map((item: any, index: number) => (
          <DetailCard
            key={index}
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
          ></DetailCard>
        ))}
      </div>

      <ModalContainerUpdated
              id="parentLoginsModal"
              isOpen={modalStates.parentLoginsModal}
              toggle={() => closeModal("parentLoginsModal")}
              modalTitle="Parent Logins"
              modalSize="lg"
            >
              <StatsCount
                toggle={() => closeModal("parentLoginsModal")}
                data= {getErpUsageStatsHyperlinkResp?.["Parent Logins"]}
                type="Parent Logins"
              ></StatsCount>
            </ModalContainerUpdated>
      
            <ModalContainerUpdated
              id="staffLoginsModal"
              isOpen={modalStates.staffLoginsModal}
              toggle={() => closeModal("staffLoginsModal")}
              modalTitle="Staff Logins"
              modalSize="lg"
            >
              <StatsCount
                toggle={() => closeModal("staffLoginsModal")}
                data= {getErpUsageStatsHyperlinkResp?.["Staff Logins"]}
                type="Staff Logins"
              ></StatsCount>
            </ModalContainerUpdated>
      
            <ModalContainerUpdated
              id="notLoginInfoModal"
              isOpen={modalStates.notLoginInfoModal}
              toggle={() => closeModal("notLoginInfoModal")}
              modalTitle="Not Login Info"
              modalSize="lg"
            >
              <StatsCount
                toggle={() => closeModal("notLoginInfoModal")}
                data= {getErpUsageStatsHyperlinkResp?.["Not Login Info"]}
                type="Not Login Info"
              ></StatsCount>
            </ModalContainerUpdated>
{/* 
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
      </ModalContainerUpdated> */}
    </>
  );
};

export default ErpUsageStatistics;
