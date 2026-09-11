import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { issuedListFilterhProps } from "./IssuedListTypes";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getIssuedItFormActList, previewItFormAct } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import PreviewModal from "./PreviewModal";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, PencilEdit02Icon, PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../hooks/modalhook";
import AddRequestModal from "./AddRequestModal";

const IssuedList = (props: any) => {
  const dispatch = useDispatch();

  const [previewModalState, setPreviewModalState] = useState({
    showModal: false
  })
  const [sentModalState, setSentModalState] = useState({
    showModal: false,
    itFormId: undefined
  })

  const { closeModal: closeEditIssuedModal, modalState: editIssuedModalState, openModal: openEditIssuedModalHndlr } = useModal();

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const [filterState, setFilterState] = useState({
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    approvedStatus: "APPROVED",
    classId: ""
  });


  const {
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp,
    issuedITFormListResp,
    feeApprovalsErrorResp,
    sentItFormResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    updateItFormResp
  } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections, feeApprovals,
      instAcademics }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        issuedITFormListResp: feeApprovals.issuedITFormListResp,
        sentItFormResp: feeApprovals.sentItFormResp,
        feeApprovalsErrorResp: feeApprovals.feeApprovalsErrorResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        updateItFormResp: feeApprovals.updateItFormResp

      }), shallowEqual);

  function getItFormRequestApiCall(otherProps?: any) {
    const payload = { branchId, ...filterState, ...otherProps, ...paginationDetailRef.current };
    dispatch(getIssuedItFormActList(generateActionPayload("get_itform", undefined, payload)));
  }
  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId: branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if ({ ...filterState, [name]: value }.academicYearId) {
      if (name === "academicYearId") {
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "", curriculumId: "" }));
        getItFormRequestApiCall({ [name]: value, classId: "", curriculumId: "" });
        props.setCurrentAcademicYearId(value);
        if (value) {
          const payload = { branchId, academicYearId: value, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 100, };
          dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
        } else {
          dispatch(resetBrchCurriculumAct(undefined));
          dispatch(resetBrchClassAct(undefined));
        }
      }
      else if (name === "curriculumId") {
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        if (value) {
          getClassApiCall(value);
        }
        getItFormRequestApiCall({ [name]: value, classId: "" });
      }
      else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getItFormRequestApiCall({ [name]: value });
      }
    }
  }

  const togglePreviewModal = () => {
    setPreviewModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
  }
  const toggleConfirmationModal = () => {
    setSentModalState((prev: any) => ({ ...prev, showModal: !prev.showModal }))
  }

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      props.setCurrentAcademicYearId(academicYearId);
      setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
      getItFormRequestApiCall({ academicYearId: academicYearId });
      const payload = { branchId, academicYearId, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 100, };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }, [])

  const issuedListRef: any = useRef({
    prevSentItFormResp: sentItFormResp,
    prevFeeApprovalsErrorResp: feeApprovalsErrorResp,
    prevUpdateItFormResp: updateItFormResp
  })

  useEffect(() => {
    const { prevSentItFormResp, prevFeeApprovalsErrorResp, prevUpdateItFormResp } = issuedListRef.current;
    if (sentItFormResp && prevSentItFormResp !== sentItFormResp) {
      toggleConfirmationModal();
      toast.success(sentItFormResp);
    }
    else if (feeApprovalsErrorResp && feeApprovalsErrorResp !== prevFeeApprovalsErrorResp) {
      toast.error(feeApprovalsErrorResp);
    }
    else if (updateItFormResp && updateItFormResp !== prevUpdateItFormResp) {
      toast.success("Updated Successfully");
      closeEditIssuedModal();
      getItFormRequestApiCall();
    }

    issuedListRef.current.prevSentItFormResp = sentItFormResp;
    issuedListRef.current.prevFeeApprovalsErrorResp = prevFeeApprovalsErrorResp;
    issuedListRef.current.prevUpdateItFormResp = updateItFormResp;
  }, [sentItFormResp, feeApprovalsErrorResp, updateItFormResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="text-muted" size={18} />,
        actionName: "Print",
        onClickHndlr: (event: any) => {
          let itFormId = event.currentTarget.getAttribute('data-id');
          dispatch(previewItFormAct(generateActionPayload('preview_it_form', { itFormId: itFormId })));
          togglePreviewModal();
        },
      },
      {
        id: 'send',
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="text-muted" size={18} />,
        actionName: "Send",
        onClickHndlr: (event: any) => {
          let itFormId = event.currentTarget.getAttribute('data-id');
          setSentModalState((prev: any) => ({ ...prev, itFormId: itFormId }));
          toggleConfirmationModal();
        }
      },
      {
        id: 'edit',
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          let id = event.currentTarget.getAttribute('data-id');
          openEditIssuedModalHndlr(id);
        }
      }
    ],
    [issuedITFormListResp]
  );

  const roleColumns = useMemo(() => generateColumns(menuOptions), [issuedITFormListResp]);

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getItFormRequestApiCall(paginationInfo);
  }

  const { content: ITFormData, pageable, totalElements, totalPages } = issuedITFormListResp || {}
  return (
    <>
      <div className="tw-inline-block tw-w-full">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-1 tw-pb-3">

          <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={filterState.searchString}
                onChange={onChangeFilterHndlr}
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={filterState.academicYearId}
              onChange={onChangeFilterHndlr}
              menuItems={academicYearListResp?.data || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="curriculumId"
              value={filterState.curriculumId}
              onChange={onChangeFilterHndlr}
              menuItems={brchCurriculumResp?.data || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              labelText="Curriculum"
              floatingLabel
            />
          </div>

          <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 2xl:tw-col-span-1">
            <SelectInput
              name="classId"
              value={filterState.classId}
              onChange={onChangeFilterHndlr}
              menuItems={branchClassResp?.content || []}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="tw-mb-0"
              labelText="Class"
              floatingLabel
            />
          </div>

        </div>

        <TableContainer
          columns={roleColumns || []}
          data={ITFormData || []}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageable?.pageNumber}
        />
      </div>
      <ModalContainerUpdated
        id="preview-it-form"
        modalSize="lg"
        modalTitle={'Print ITForm'}
        // headerClassName="bg-white"
        isOpen={previewModalState.showModal}
        toggle={togglePreviewModal}
      >
        <PreviewModal />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="confirmation-modal"
        modalSize="md"
        // headerClassName="bg-white"
        isOpen={sentModalState.showModal}
        toggle={toggleConfirmationModal}
        hideHeader={true}
      >
        <ConfirmationModal itFormId={sentModalState.itFormId} toggle={toggleConfirmationModal} />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="confirmation-modal"
        modalSize="md"
        // headerClassName="bg-white"
        isOpen={editIssuedModalState.showModal}
        toggle={closeEditIssuedModal}
        hideHeader={true}
      >
        <AddRequestModal 
          toggle={closeEditIssuedModal} 
          branchId={branchId} 
          instituteId={instituteId} 
          isOpen={editIssuedModalState.showModal} 
          modalTitle="Edit Issued Request" 
          id={editIssuedModalState.modalData}
        />
      </ModalContainerUpdated>

    </>
  );
};

export default IssuedList;
