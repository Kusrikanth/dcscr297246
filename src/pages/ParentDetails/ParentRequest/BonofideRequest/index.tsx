import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  generateColumns,
} from "./helper";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { BonafideCertificateFilterhProps, BonafideCertificateModal } from "../../../NewAcademics/BonafideCertificate/bonafideCertificateTypes";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { bonafideCerificateList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ModalContainerUpdated } from "../../../../Components/Common";
import BonafideCertiPrintModal from "../../../NewAcademics/BonafideCertificate/BonafideCertiPrintModal";
import NewBonafideCertificateModal from "../../../NewAcademics/BonafideCertificate/NewBonafideCertificateModal";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";

const initialValues: BonafideCertificateFilterhProps = {
  nameFilterType: "",
  branchId: "",
  search: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  preparationStatus: "",
  issuanceDate: "",
};

const BonafideRequest = () => {
  const [bonafideCertificateFilterState, setBonafideCertificateFilterState] =
    useState<BonafideCertificateFilterhProps>(initialValues);
  const [currentStudent, setCurrentStudent] = useState<any>(undefined);

  const dispatch = useDispatch();

  const { currentInstIdResp: instituteId, academicYearListResp, bonafideCerificates,
    addBonafideCertificateRes,
    classroomManagmentErrorResp, currentStudentId, parentChildrensResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, directoryStudent, login }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentStudentId: appData.currentStudentId,
        academicYearListResp: instAcademics.academicYearListResp,
        bonafideCerificates: classroomManagmentInfo.bonafideCerificates,
        addBonafideCertificateRes: classroomManagmentInfo.addBonafideCertificateRes,
        issueBonafideCerificateRes: classroomManagmentInfo.issueBonafideCerificateRes,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
      }),
      shallowEqual
    );

  const getBonafideCertificateList = (otherProps?: any) => {
    let params = { ...bonafideCertificateFilterState, ...paginationFilter.current, ...otherProps, nameFilterType: "global" };
    dispatch(bonafideCerificateList(generateActionPayload('bonafide_certificate_list', undefined, params)))
  }

  const [
    bonafideCertificatePrintModalState,
    setBonafideCertificatePrintModalState,
  ] = useState<BonafideCertificateModal>({
    showModal: false,
    branchId: "",
    bonafideRequestId: "",
  });

  const [newBonafideCertificateModalState, setNewBonafideCertificateModalState] =
    useState<any>({
      showModal: false,
      bonafideId: "",
    });

  const toggleBonafideCertificatePrintModal = useCallback(
    (bonafideRequestId: any, apiCall?: boolean) => {
      setBonafideCertificatePrintModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
        bonafideRequestId: bonafideRequestId,
      }));
    },
    []
  );

  const toggleBonafideCertificateModal = (apiCall?: any, bonafideId?: any) => {
    setNewBonafideCertificateModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      bonafideId: bonafideId
    }));
    if (typeof (apiCall) === 'boolean' && apiCall) {
      getBonafideCertificateList();
    }
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "print",
        actionIcon: <PrintSvg className="me-2 d-inline-block" stroke="#707070" />,
        actionName: "Bonafide Certificate Print",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleBonafideCertificatePrintModal(id);
        },
      },
    ],
    []
  );


  useEffect(() => {
    if (parentChildrensResp) {
      parentChildrensResp?.forEach((item: any) => {
        if (+item?.childId === +currentStudentId) {
          setCurrentStudent(item);
          getBonafideCertificateList({
            branchId: item?.childBranchId,
            search: item?.childCode, academicYearId: item?.academicYearId,
            curriculumId: item?.curriculumId, classId: item?.classId
          })
          const payload = { instituteId: item?.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
          dispatch(
            getInstAcademicYearAct(
              generateActionPayload("get_inst_academic_year", undefined, payload)
            )
          );
          setBonafideCertificateFilterState((prev: any) => ({
            ...prev,
            branchId: item?.childBranchId,
            search: item?.childCode,
            academicYearId: item?.academicYearId,
            curriculumId: item?.curriculumId, classId: item?.classId
          }))
        }
      })
    }
  }, [parentChildrensResp, currentStudentId]);


  const paginationFilter = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const BonafideCertificateRef = useRef({
    prevAddBonafideCertificateRes: addBonafideCertificateRes,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevAddBonafideCertificateRes, prevClassroomManagmentErrorResp } = BonafideCertificateRef.current;
    if (addBonafideCertificateRes && addBonafideCertificateRes !== prevAddBonafideCertificateRes) {
      toast.success('Bonafide Certificate Request Added Successfully.');
      toggleBonafideCertificateModal(true);
    } else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details);
    }

    BonafideCertificateRef.current.prevAddBonafideCertificateRes = addBonafideCertificateRes;
    BonafideCertificateRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [classroomManagmentErrorResp, addBonafideCertificateRes])

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationFilter.current = paginationInfo;
    getBonafideCertificateList(paginationInfo);
  }


  const { data: bonafideCerificateData, totalPages, totalElements, pageNumber } = bonafideCerificates || {};
  const hideAddReqBtn = Array.isArray(bonafideCerificateData) ?
    bonafideCerificateData.some(item => item?.preparationStatus === 'NOT ISSUED') : false;
  const roleColumns = useMemo(() => generateColumns(menuOptions), [bonafideCerificates]);
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Bonafide Certificate" pageTitle="Request" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-w-full">

                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Bonafide Request
                  </h4>
                </div>

                {!hideAddReqBtn && (
                  <div className="tw-ml-auto">
                    <Button
                      variant="primary"
                      onClick={toggleBonafideCertificateModal}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add Request
                    </Button>
                  </div>
                )}

              </div>
            </div>

            <div className="tw-p-0">
              <TableContainer
                columns={roleColumns || []}
                data={bonafideCerificateData || []}
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="bonafide-certificate-print-modal"
        isOpen={bonafideCertificatePrintModalState.showModal}
        toggle={() => toggleBonafideCertificatePrintModal(undefined)}
        modalTitle="Bonafide Certificate"
        modalSize="xl"
      >
        <BonafideCertiPrintModal
          isOpen={bonafideCertificatePrintModalState.showModal}
          bonafideRequestId={bonafideCertificatePrintModalState.bonafideRequestId}
          toggle={toggleBonafideCertificatePrintModal}
          modalTitle={"Bonafide Certificate"}
          branchId={bonafideCertificatePrintModalState.branchId}
          digitalSign={true}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="offline-bonafide-certificate-modal"
        isOpen={newBonafideCertificateModalState.showModal}
        toggle={toggleBonafideCertificateModal}
        modalTitle={`${newBonafideCertificateModalState.bonafideId ? "Edit" : "Add"} Request`}
        modalSize="lg"
      >
        <NewBonafideCertificateModal
          isOpen={newBonafideCertificateModalState.showModal}
          toggle={toggleBonafideCertificateModal}
          modalTitle={`${newBonafideCertificateModalState.bonafideId ? "Edit" : "Add"} Request`}
          instituteId={currentStudent?.instituteId}
          currentStudent={currentStudent}
          academicYearId={currentStudent?.academicYearId}
          requestBy="PARENT"
          branchId={currentStudent?.childBranchId}
          bonafideId={newBonafideCertificateModalState.bonafideId}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BonafideRequest;
