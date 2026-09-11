import {
  ModalContainerUpdated,
  SkeletonLoader,
} from "../../../../Components/Common";
import { useEffect, useState } from "react";
import AdmissionsCount from "./AdmissionsCount";
import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  UserGroup03Icon,
  ValidationApprovalIcon,
  LicenseDraftIcon,
  AddToListIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAdmissionStatsAct, getAdmissionStatsHyperlinkAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const cardList = [
  {
    id: "admissionCount",
    bgColor: "#E3E7FB",
    cardIcon: <HugeiconsIcon icon={UserGroup03Icon} size={26} color={"#000000"} />,
    cardMainText: "Admission Count",
    cardCurriculumData: [
      { curriculumName: "CAMBRIDGE INTERNATIONAL", show: "CAMBRIDGE" },
      { curriculumName: "CBSE", show: "CBSE" },
      { curriculumName: "EARLY YEARS", show: "EY1-EY3" },
    ],
  },
  {
    id: "thisWeekRegistrations",
    bgColor: "#FCEEDF",
    cardIcon: <HugeiconsIcon icon={ValidationApprovalIcon} size={26} color={"#000000"} />,
    cardMainText: "This Week Registrations",
    cardCurriculumData: [
      { curriculumName: "CAMBRIDGE INTERNATIONAL", show: "CAMBRIDGE" },
      { curriculumName: "CBSE", show: "CBSE" },
      { curriculumName: "EARLY YEARS", show: "EY1-EY3" },
    ],
  },
  {
    id: "thisWeekApplications",
    bgColor: "#ebeedf",
    cardIcon: <HugeiconsIcon icon={LicenseDraftIcon} size={26} color={"#000000"} />,
    cardMainText: "This Week Applications",
    cardCurriculumData: [
      { curriculumName: "CAMBRIDGE INTERNATIONAL", show: "CAMBRIDGE" },
      { curriculumName: "CBSE", show: "CBSE" },
      { curriculumName: "EARLY YEARS", show: "EY1-EY3" },
    ],
  },
  {
    id: "thisWeekAdmissions",
    bgColor: "#EAF7DB",
    cardIcon: <HugeiconsIcon icon={AddToListIcon} size={26} color={"#000000"} />,
    cardMainText: "This Week Admissions",
    cardCurriculumData: [
      { curriculumName: "CAMBRIDGE INTERNATIONAL", show: "CAMBRIDGE" },
      { curriculumName: "CBSE", show: "CBSE" },
      { curriculumName: "EARLY YEARS", show: "EY1-EY3" },
    ],
  },
];

const AdmissionStats = ({ branchId , curriculumId , academicYearId }: any) => {

  const dispatch = useAppDispatch();
  const [modalStates, setModalStates] = useState({
    admissionCount: false,
    thisWeekRegistrations: false,
    thisWeekApplications: false,
    thisWeekAdmissions: false,
  });

  const { value, userList, loginErrorResp, currentBranchIdResp, currentInstIdResp: instituteId,
    getAdmissionStatsResp, academicYearListResp, applicationSaleError, getAdmissionStatsHyperlinkResp
  } = useAppSelector(
    ({ login: { value, userList, loginErrorResp }, instAcademics, appData, applicationSale }) => ({
      value,
      userList,
      loginErrorResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAdmissionStatsResp: applicationSale.getAdmissionStatsResp,
      applicationSaleError: applicationSale.applicationSaleError,
      getAdmissionStatsHyperlinkResp: applicationSale.getAdmissionStatsHyperlinkResp
    }),
    shallowEqual
  );

  const openModal = (modalId: string) => {
    setModalStates((prev) => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModalStates((prev) => ({ ...prev, [modalId]: false }));
  };

  const admissionStatsApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      curriculumId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getAdmissionStatsAct(generateActionPayload('admission_stats', undefined, payload)))
  }

  const admissionStatsHyperlinkApiCall = (otherProps?: any) => {
    const payload = {
      instituteId, 
      academicYearId,
    };
    dispatch(getAdmissionStatsHyperlinkAct(generateActionPayload('admission_stats_hyperlink', undefined, payload)))
  }

  useEffect(() => {
    if (branchId || academicYearId || curriculumId) {
      admissionStatsApiCall();
    }
  }, [branchId,academicYearId,curriculumId])
  
  useEffect(() => {
    if (academicYearId) {
      admissionStatsHyperlinkApiCall();
    }
  },[academicYearId])

  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        {cardList.map((card) => (
          <StatsCard
            id={card.id}
            bgColor={card.bgColor}
            cardIcon={card.cardIcon}
            cardMainText={card.cardMainText}
            cardCurriculumData={card.cardCurriculumData}
            key={card.cardMainText}
            getAdmissionStatsResp={getAdmissionStatsResp}
            openModal={() => !branchId &&  academicYearId && !curriculumId && openModal(card.id)}
            branchId={branchId}
            academicYearId={academicYearId}
            curriculumId={curriculumId}
          ></StatsCard>
        ))}
      </div>

      <ModalContainerUpdated
        id="admissionCount"
        isOpen={modalStates.admissionCount}
        toggle={() => closeModal("admissionCount")}
        modalTitle="Admission Count"
        modalSize="lg"
      >
        <AdmissionsCount
          toggle={() => closeModal("admissionCount")}
          data={getAdmissionStatsHyperlinkResp?.admissionCount}
        ></AdmissionsCount>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="thisWeekRegistrations"
        isOpen={modalStates.thisWeekRegistrations}
        toggle={() => closeModal("thisWeekRegistrations")}
        modalTitle="This Week Registrations"
        modalSize="lg"
      >
        <AdmissionsCount
          toggle={() => closeModal("thisWeekRegistrations")}
          data={getAdmissionStatsHyperlinkResp?.thisWeekRegistrations}
        ></AdmissionsCount>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="thisWeekApplications"
        isOpen={modalStates.thisWeekApplications}
        toggle={() => closeModal("thisWeekApplications")}
        modalTitle="This Week Applications"
        modalSize="lg"
      >
        <AdmissionsCount
          toggle={() => closeModal("thisWeekApplications")}
          data={getAdmissionStatsHyperlinkResp?.thisWeekApplications}
        ></AdmissionsCount>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="thisWeekAdmissions"
        isOpen={modalStates.thisWeekAdmissions}
        toggle={() => closeModal("thisWeekAdmissions")}
        modalTitle="This Week Admissions"
        modalSize="lg"
      >
        <AdmissionsCount
          toggle={() => closeModal("thisWeekAdmissions")}
          data={getAdmissionStatsHyperlinkResp?.thisWeekAdmissions}
        ></AdmissionsCount>
      </ModalContainerUpdated>
    </>
  );
};

export default AdmissionStats;

const StatsCard = (props: any) => {
    const { id, bgColor, cardIcon, cardMainText, openModal, getAdmissionStatsResp, cardCurriculumData, branchId, academicYearId, curriculumId } = props || {}
    const cardMainAmount = cardCurriculumData?.reduce((total: number, item: any) => (+getAdmissionStatsResp?.[id]?.[item?.curriculumName] || 0) + total, 0);
    const canOpenModal = !branchId && academicYearId && !curriculumId;

    return (
        <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-3 tw-px-1">
            <div
                className="card tw-mb-4 tw-px-0 tw-pb-2 tw-pt-3 !tw-rounded-2xl"
                style={{ backgroundColor: `${bgColor}` }}
            >
                <div className="tw-px-3 tw-flex tw-justify-between tw-items-center">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <div
                            className="tw-w-12 tw-h-12 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-3"
                        >
                            {cardIcon}
                        </div>
                        <h6 className="tw-mr-2 tw-flex tw-items-center">{`${cardMainText}`}</h6>
                    </div>
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <h5 className="tw-mb-0 tw-font-semibold">
                            <span
                                className={canOpenModal ? "tw-text-sky-600 tw-cursor-pointer" : ""}
                                onClick={openModal}
                            >
                                {cardMainAmount}
                            </span>
                        </h5>
                    </div>
                </div>
                <div
                    className="tw-grid tw-grid-cols-3 tw-bg-white tw-p-2 tw-m-1 tw-mx-3 tw-rounded-2xl"
                >
                    {[...Array(3)].map((_, index) => {
                        const curriculum = cardCurriculumData[index] || {
                            curriculumName: "",
                            value: "",
                        };
                        const value = getAdmissionStatsResp?.[id]?.[curriculum?.curriculumName] || 0;
                        return (
                            <div
                                className={`tw-flex tw-flex-col tw-items-center tw-justify-center ${index === 2 ? "" : "tw-border-r"
                                    }`}
                                key={index}
                            >
                                {curriculum?.curriculumName ? (
                                    <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                        <span className="tw-text-sm tw-mb-0">{value}</span>
                                    </div>
                                ) : (
                                    <SkeletonLoader width="50%" height="10px" />
                                )}

                                {curriculum?.show ? (
                                    <div className="tw-flex tw-justify-between">
                                        <h6 className="tw-text-xs tw-text-gray-500 tw-font-normal tw-mb-0 tw-truncate">
                                            {curriculum?.show}
                                        </h6>
                                    </div>
                                ) : (
                                    <SkeletonLoader width="100%" height="10px" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};