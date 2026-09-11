import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal } from "../../../Components/Common";

import AlmanacUploadedModel from "./AlmanacUploadedModel";
import {
  generateColumns,
} from "./helper";
import HeaderFilter, { initialFilterValues } from "../../../Components/HeaderFilter";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { delAlamanacAct, getAlamanacList, getUploadDocumentPreviewAct } from "../../../store/academic/academicRequest/academicrequestactions";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import PreviewUploadDocuments from "./PreviewUploadDocuments";
import Button from "../../../Components/Common/Button";

const AlmanacUploaded = () => {
    const { closeModal: closeUploadDocPreviewModal, modalState: uploadDocPreviewModalState, openModal: openUploadDocPreviewModal } = useModal();
      const [AlmanacUploadedModelState, setAlmanacUploadedModelState] = useState({
    showModal: false,
    branchId: "",
  });
  const { modalState: delAlamanacModalState, closeModal: closeAlamanacModalHndlr,
    openModal: openAlamanacModalHndlr
  } = useModal();

  const filtersRef = useRef<any>(initialFilterValues);
  const paginationRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    alamanacListResp,
    deleteAlamanacResp,
    academicRequestErrorResp } =
    useAppSelector(({ appData, academicRequest }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      alamanacListResp: academicRequest.alamanacListResp,
      deleteAlamanacResp: academicRequest.deleteAlamanacResp,
      academicRequestErrorResp: academicRequest.academicRequestErrorResp,
    }), shallowEqual);

  const alamanacRef = useRef({
    prevDeleteAlamanacResp: deleteAlamanacResp,
    prevAcademicRequestErrorResp: academicRequestErrorResp
  })

  useEffect(() => {
    const { prevDeleteAlamanacResp, prevAcademicRequestErrorResp } = alamanacRef.current;
    if (deleteAlamanacResp && prevDeleteAlamanacResp !== deleteAlamanacResp) {
      toast.success("Almanac deleted successfully.");
      closeAlamanacModalHndlr();
      getAlamacApiCall();
    } else if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
      const { message, details } = academicRequestErrorResp;
      toast.error(message || details || "Something went wrong.");
    }
    alamanacRef.current.prevDeleteAlamanacResp = deleteAlamanacResp;
    alamanacRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
  }, [deleteAlamanacResp, academicRequestErrorResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "previewDocument",
        actionIcon: (
          <HugeiconsIcon
            icon={EyeIcon}
            className="tw-text-gray-500"
            size={18}
          />
        ),
        actionName: "Preview",
        onClickHndlr: (event: any) => {
          const fullId = event.currentTarget.getAttribute("data-id");
          const [, systemFileId] = fullId?.split("__") || [];
          if (systemFileId) {
            dispatch(
              getUploadDocumentPreviewAct(
                generateActionPayload("upload_doc_preview", { systemFileId })
              )
            );
            openUploadDocPreviewModal(systemFileId);
          }
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const fullId = event.currentTarget.getAttribute("data-id");
          const [alamanacId] = fullId?.split("__") || [];
          if (!alamanacId) return;
          openAlamanacModalHndlr(alamanacId);
        },
      },
    ],
    [alamanacListResp]
  );
  const toggleAlmanacUploadedModel = (apiCall?: any) => {
    if (typeof apiCall === "boolean" && apiCall) {
      getAlamacApiCall();
    }
    setAlmanacUploadedModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  function getAlamacApiCall(otherProps?: any) {
    const payload = {
      branchId,
      ...filtersRef.current,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getAlamanacList(generateActionPayload("get_alamanac_list", undefined, payload)));
  }

  function updateFilterHandler(filterValues: any) {
    paginationRef.current.pageNo = 0;
    filtersRef.current = filterValues;
    getAlamacApiCall();
  }

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getAlamacApiCall();
  }


  function confirmDeleteAlamanacHndlr() {
    const { modalData } = delAlamanacModalState;
    dispatch(delAlamanacAct(generateActionPayload("del_alamanac", { alamanacId: modalData })));
  }
  const columns = useMemo(() => generateColumns(menuOptions), [alamanacListResp]);
  const { data: alamanacTableData, totalPages, totalElements, pageNumber } = alamanacListResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb
            pageTitle="Academics"
          />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Almanac Uploaded Documents Details
                </h4>
                <Button
                  type="button"
                  variant="primary"
                  onClick={toggleAlmanacUploadedModel}
                >
                  <i className="ri-add-line tw-mr-2"></i>
                  Upload
                </Button>
              </div>
            </div>
            <div className="">
              <HeaderFilter
                branchId={branchId}
                instituteId={instituteId}
                dispatch={dispatch}
                filterValues={filtersRef.current}
                updateFilterHandler={updateFilterHandler}
              />
            </div>
            <TableContainer
              columns={columns}
              data={Array.isArray(alamanacTableData) ? alamanacTableData : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber || 0}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={AlmanacUploadedModelState.showModal}
        toggle={toggleAlmanacUploadedModel}
        modalTitle="Almanac Upload"
        modalSize="md"
      >
        <AlmanacUploadedModel
          isOpen={AlmanacUploadedModelState.showModal}
          toggle={toggleAlmanacUploadedModel}
          modalTitle="Almanac Upload"
          branchId={branchId}
          instituteId={instituteId}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-admissionwithdrawal-modal"
        isOpen={delAlamanacModalState.showModal}
        confirmMessage="Are you sure you want to delete this Almanac?"
        cancelHndlr={closeAlamanacModalHndlr}
        confirmHndlr={confirmDeleteAlamanacHndlr}
        showImgIcon={true}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="add-upload-documents-modal"
        isOpen={uploadDocPreviewModalState.showModal}
        toggle={closeUploadDocPreviewModal}
        modalTitle="Preview Almanac Document"
        modalSize="lg"
      >
        <PreviewUploadDocuments
          isOpen={uploadDocPreviewModalState.showModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AlmanacUploaded;
