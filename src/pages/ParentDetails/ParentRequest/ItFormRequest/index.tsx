import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { itFormListByStudentIdGen, previewItFormAct } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import PreviewModal from "../../../FreeModules/ItFormApprovals/IssuedList/PreviewModal";
import AddRequestModal from "../../../FreeModules/ItFormApprovals/RequestedList/AddRequestModal";
import Button from "../../../../Components/Common/Button";

const ItFormRequests = () => {
  const dispatch = useAppDispatch();
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [addRequestModal, setAddRequestModal] =
    useState<any>({
      showModal: false,
      branchId: "",
    });

  const [previewModalState, setPreviewModalState] = useState({
    showModal: false
  })

  const {
    itFormListByStudentIdResp,
    currentInstIdResp: instituteId, addRequestItFormResp,
    currentStudentId, parentChildrensResp, feeApprovalsErrorResp
  } =
    useAppSelector(({ appData, directoryStudent, feeApprovals,
      instAcademics }) => ({
        itFormListByStudentIdResp: feeApprovals.itFormListByStudentIdResp,
        sentItFormResp: feeApprovals.sentItFormResp,
        feeApprovalsErrorResp: feeApprovals.feeApprovalsErrorResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
        addRequestItFormResp: feeApprovals.addRequestItFormResp,
      }), shallowEqual);

  const itFormRequestRef = useRef({
    prevFeeApprovalsErrorResp: feeApprovalsErrorResp
  });

  useEffect(() => {
    const { prevFeeApprovalsErrorResp } = itFormRequestRef.current;
    if (feeApprovalsErrorResp && prevFeeApprovalsErrorResp !== feeApprovalsErrorResp) {
      const { details } = feeApprovalsErrorResp;
      toast.error(details || 'Something went wrong.');
    }
    itFormRequestRef.current.prevFeeApprovalsErrorResp = feeApprovalsErrorResp
  }, [feeApprovalsErrorResp]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  const toggleAddRequestModal = () => {
    setAddRequestModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };


  function getItFormRequestApiCall(studentId: any, otherProps?: any) {
    const payload = { ...otherProps };
    dispatch(itFormListByStudentIdGen(generateActionPayload("get_itform_bystudentid", { studentId }, payload)));
  }

  const togglePreviewModal = () => {
    setPreviewModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
  }

  const issuedListRef: any = useRef({
    prevAddRequestItFormResp: addRequestItFormResp,
  })

  useEffect(() => {
    const { prevAddRequestItFormResp } = issuedListRef.current;
    if (addRequestItFormResp && addRequestItFormResp !== prevAddRequestItFormResp) {
      toast.success('IT Form Request Submitted Successfully.');
      toggleAddRequestModal();
      getItFormRequestApiCall(currentStudent?.childId);
    }
    issuedListRef.current.prevAddRequestItFormResp = addRequestItFormResp;
  }, [addRequestItFormResp, currentStudent])

  useEffect(() => {
    if (parentChildrensResp) {
      parentChildrensResp?.forEach((item: any) => {
        if (+item?.childId === +currentStudentId) {
          setCurrentStudent(item)
          getItFormRequestApiCall(item?.childId);
        }
      })
    }
  }, [parentChildrensResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "print",
        actionIcon: <PrintSvg stroke="#707070" />,
        actionName: "Print",
        onClickHndlr: (event: any) => {
          let itFormId = event.currentTarget.getAttribute('data-id');
          dispatch(previewItFormAct(generateActionPayload('preview_it_form', { itFormId: itFormId })));
          togglePreviewModal();
        },
      }
    ],
    [itFormListByStudentIdResp]
  );

  const roleColumns = useMemo(() => generateColumns(menuOptions), [itFormListByStudentIdResp]);
  const hideAddReqBtn = Array.isArray(itFormListByStudentIdResp) ?
    itFormListByStudentIdResp.some(item => item?.approvedStatus === 'PENDING') : false;
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="IT Form Approvals" pageTitle="Request" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-p-3 tw-border-b">
              <div className="tw-flex tw-items-center tw-w-full">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  IT Form Requests
                </h4>

                {!hideAddReqBtn && (
                  <div className="tw-ml-auto">
                    <Button
                    variant="primary"
                      onClick={toggleAddRequestModal}
                    >
                      Add Request
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="tw-inline-block tw-w-full">
              <TableContainer
                columns={roleColumns || []}
                data={
                  Array.isArray(itFormListByStudentIdResp)
                    ? itFormListByStudentIdResp
                    : []
                }
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={false}
              />
            </div>
            <ModalContainerUpdated
              id="preview-it-form"
              modalSize="lg"
              modalTitle='Print ITForm'
              isOpen={previewModalState.showModal}
              toggle={togglePreviewModal}
            >
              <PreviewModal />
            </ModalContainerUpdated>

          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-itform-modal"
        isOpen={addRequestModal.showModal}
        toggle={toggleAddRequestModal}
        modalSize="lg"
        modalTitle="IT Form Request"
      >

        <AddRequestModal
          isOpen={addRequestModal.showModal}
          toggle={toggleAddRequestModal}
          modalTitle="IT Form Request"
          instituteId={currentStudent?.instituteId}
          currentStudent={currentStudent}
          branchId={currentStudent?.childBranchId}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ItFormRequests;
