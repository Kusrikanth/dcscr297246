import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { documentTypes, generateColumns } from "./helper";
import MasterDocumentsModel from "./MasterDocumentsModel";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { deleteMasterDocumentsListAct, getMasterDocumentsListAct, getMasterDocumentsListByIdAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { useFilterState } from "../../../../hooks/filterhook";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  documentType: "",
};

const MasterDocuments = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const [masterDocuments, setMasterDocuments] = useState(initialValues);
  const [masterDocumentsModelState, setMasterDocumentsModelState] = useState({
    showModal: false,
    id: undefined
  })

  const [delMasterDocumentsModalState, setDelMasterDocumentsModalState] = useState({
    showModal: false,
    id: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });


  const toggleMasterDocumentsModel = (id?: any) => {
    setMasterDocumentsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const toggleDelMasterDocumentsModel = (id?: any) => {
    setDelMasterDocumentsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }

  const delMasterDocumentsConfirmHndler = () => {
    dispatch(deleteMasterDocumentsListAct(generateActionPayload("delete_master_document", { id: delMasterDocumentsModalState.id },)));
  }

  const masterDocumentsList = (otherProps?: any) => {
    const { searchString, documentType } = masterDocuments;
    let payload = {
      branchId,
      searchString,
      documentType,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getMasterDocumentsListAct(generateActionPayload("get_master_document_list", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getMasterDocumentsListResp,
    saveMasterDocumentsResp,
    editMasterDocumentsRequestResp,
    delMasterDocumentsRequestResp,
    academicAvailabilityErrorResp,
  } = useAppSelector(
    ({ admissionAvailabilityRequest, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getMasterDocumentsListResp: admissionAvailabilityRequest.getMasterDocumentsListResp,
      saveMasterDocumentsResp: admissionAvailabilityRequest.saveMasterDocumentsResp,
      editMasterDocumentsRequestResp: admissionAvailabilityRequest.editMasterDocumentsRequestResp,
      delMasterDocumentsRequestResp: admissionAvailabilityRequest.delMasterDocumentsRequestResp,
      academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
    }),
    shallowEqual
  );

  const masterDocumentsRef = useRef({
    prevAddMasterDocuments: saveMasterDocumentsResp,
    prevEditMasterDocuments: editMasterDocumentsRequestResp,
    prevDeleteLibraryRequestListResp: delMasterDocumentsRequestResp,
    prevMasterDocumentsErrorResp: academicAvailabilityErrorResp,
  });

  useEffect(() => {
    const { prevAddMasterDocuments, prevEditMasterDocuments, prevDeleteLibraryRequestListResp, prevMasterDocumentsErrorResp } = masterDocumentsRef.current;
    if (saveMasterDocumentsResp && prevAddMasterDocuments !== saveMasterDocumentsResp) {
      toast.success("Master Documents successfully.");
      toggleMasterDocumentsModel()
      masterDocumentsList()
    }
    else if (editMasterDocumentsRequestResp && prevEditMasterDocuments !== editMasterDocumentsRequestResp) {
      toast.success("Master Documents updated successfully.");
      toggleMasterDocumentsModel()
      masterDocumentsList()
    }
    else if (delMasterDocumentsRequestResp && prevDeleteLibraryRequestListResp !== delMasterDocumentsRequestResp) {
      toast.success("Master Documents deleted successfully.");
      toggleDelMasterDocumentsModel()
      masterDocumentsList()
    }
    else if (academicAvailabilityErrorResp && prevMasterDocumentsErrorResp !== academicAvailabilityErrorResp) {
      const { details } = academicAvailabilityErrorResp;
      toast.error(details);
    }
    masterDocumentsRef.current.prevDeleteLibraryRequestListResp = delMasterDocumentsRequestResp;
    masterDocumentsRef.current.prevEditMasterDocuments = editMasterDocumentsRequestResp;
    masterDocumentsRef.current.prevAddMasterDocuments = saveMasterDocumentsResp;
    masterDocumentsRef.current.prevMasterDocumentsErrorResp = academicAvailabilityErrorResp;

  }, [saveMasterDocumentsResp, editMasterDocumentsRequestResp, delMasterDocumentsRequestResp, academicAvailabilityErrorResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getMasterDocumentsListByIdAct(generateActionPayload("get_master_document_by_id", { id: id })));
          toggleMasterDocumentsModel(id)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDelMasterDocumentsModel(id)
        },
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  useEffect(() => {
    masterDocumentsList();
  }, []);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setMasterDocuments((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    masterDocumentsList({ [name]: value });
  };

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    setMasterDocuments({ ...initialValues });
    masterDocumentsList({ ...initialValues });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    masterDocumentsList(paginationInfo);
  }

  const { content: masterDocumentsResp, totalElements, totalPages, pageable } = getMasterDocumentsListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Admissions" pageTitle="Admissions" />

          <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-6">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">Master Documents</h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <form>
                <div className="tw-grid tw-gap-3 tw-px-3 tw-pt-3 tw-grid-cols-12">

                  {/* Search Box */}
                  <div className="tw-col-span-3">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-3"
                        placeHolder="Search..."
                        value={masterDocuments.searchString}
                        onChange={filterHandler}
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="tw-col-span-2 ">
                    <SelectInput
                      name="documentType"
                      value={masterDocuments.documentType}
                      onChange={filterHandler}
                      menuItems={documentTypes}
                      valueKey="documentType"
                      textKey="documentName"
                      formgroupClassName="tw-mb-3"
                      labelText="Document Type"
                      floatingLabel
                    />
                  </div>

                  {/* Clear Filter */}
                  {showClearFilterState && (
                    <div className="tw-col-span-5 tw-ml-auto  tw-mb-3">
                      <Button
                        type="button"
                        onClick={clearFilterHndlr}
                        variant='wrong'
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}

                  {/* Add New Button */}
                  <div className="tw-col-span-7 tw-ml-auto">
                    <div className="tw-flex">
                      <Button
                        type="button"
                        variant='primary'
                        onClick={() => toggleMasterDocumentsModel()}
                      >
                        <i className="ri-add-line tw-mr-2" />
                        Add New
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              <TableContainer
                columns={columns || []}
                data={masterDocumentsResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="master-documents-modal"
        isOpen={masterDocumentsModelState.showModal}
        toggle={() => toggleMasterDocumentsModel()}
        modalTitle={masterDocumentsModelState.id ? "Edit Master Documents" : "Create Details"}
        modalSize="md"
      >
        <MasterDocumentsModel
          id={masterDocumentsModelState.id}
          toggle={() => toggleMasterDocumentsModel()}
          modalTitle="Create Master Documents" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-master-documents-modal"
        isOpen={delMasterDocumentsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Document ?"
        cancelHndlr={() => toggleDelMasterDocumentsModel()}
        confirmHndlr={delMasterDocumentsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default MasterDocuments;
