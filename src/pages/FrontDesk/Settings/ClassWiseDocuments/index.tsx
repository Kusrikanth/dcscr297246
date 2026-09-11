import { useEffect, useMemo, useRef, useState } from "react";
import {  ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { useFilterState } from "../../../../hooks/filterhook";
import {  getClassWiseDocumentsListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import {  getBranchCurriculumAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import ExtensionDetailsModel from "./ExtensionDetailsModel";
import AssignDocumentModel from "./AssignDocumentModel";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  curriculumId: "",
  academicYearId: "",
};

const ClassWiseDocuments = () => {
  const dispatch = useAppDispatch();
  const { showClearFilterState } = useFilterState()
  const [masterDocuments, setClassWiseDocuments] = useState(initialValues);

  const { closeModal:closeViewNoOfExtensionModal,modalState:viewNoOfExtensionModalState,openModal:openViewNoOfExtensionModal } = useModal();
  const { closeModal:closeAssignDocModal,modalState:assignDocModalState,openModal:openAssignDocModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const classWiseDocumentsList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...masterDocuments,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getClassWiseDocumentsListAct(generateActionPayload("get_class_wise_document_list", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    brchCurriculumResp,
    getClassWiseDocumentsListResp,
    saveClassWiseDocumentsResp,
    academicAvailabilityErrorResp,
  } = useAppSelector(
    ({ admissionAvailabilityRequest, appData, instAcademics, branchAcademics }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getClassWiseDocumentsListResp: admissionAvailabilityRequest.getClassWiseDocumentsListResp,
      saveClassWiseDocumentsResp: admissionAvailabilityRequest.saveClassWiseDocumentsResp,
      academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
    }),
    shallowEqual
  );

  const ClassWiseDocumentsRef = useRef({
    prevAddClassWiseDocuments: saveClassWiseDocumentsResp,
    prevClassWiseDocumentsErrorResp: academicAvailabilityErrorResp,
  });

  useEffect(() => {
    const { prevAddClassWiseDocuments, prevClassWiseDocumentsErrorResp } = ClassWiseDocumentsRef.current;
    if(saveClassWiseDocumentsResp && saveClassWiseDocumentsResp !== prevAddClassWiseDocuments) {
      toast.success("Class Wise Documents Assigned successfully.");
      closeAssignDocModal()
      classWiseDocumentsList()
    }
    else if (academicAvailabilityErrorResp && prevClassWiseDocumentsErrorResp !== academicAvailabilityErrorResp) {
      const { details } = academicAvailabilityErrorResp;
      toast.error(details || "something went wrong. Please try again later.");
    }
    ClassWiseDocumentsRef.current.prevAddClassWiseDocuments = saveClassWiseDocumentsResp;
    ClassWiseDocumentsRef.current.prevClassWiseDocumentsErrorResp = academicAvailabilityErrorResp;

  }, [saveClassWiseDocumentsResp, academicAvailabilityErrorResp]);

  const columns = useMemo(() => generateColumns( openViewNoOfExtensionModal, openAssignDocModal), []);

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
    }
  }, []);

const getCurriculumApiCall = (otherProps?: any) => {
  const payload1 = { academicYearId: masterDocuments.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
  if(payload1.academicYearId){
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
}

useEffect(() => {
  if(academicYearListResp){
    let yearId = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId
    setClassWiseDocuments((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({academicYearId: yearId})
  }
}, [academicYearListResp]);

useEffect(() => {
    if (brchCurriculumResp) {
        const { branchCurriculumId } = brchCurriculumResp.data?.find((item: any) => item?.curriculumName === "CBSE") || {};
        setClassWiseDocuments((prevState: any) => ({
            ...prevState, curriculumId: branchCurriculumId
        }));
        classWiseDocumentsList({ ...masterDocuments, curriculumId: branchCurriculumId });
    }
}, [ brchCurriculumResp]);

  function filterHandler (event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if(name === "academicYearId"){
      if(value){
        getCurriculumApiCall({academicYearId:value});
        setClassWiseDocuments((prev) => ({ ...prev, [name]: value,curriculumId:"" }));
      }
    }
    else{
      setClassWiseDocuments((prev) => ({ ...prev, [name]: value }));
      classWiseDocumentsList({ [name]: value });
    }
  }

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    setClassWiseDocuments({ ...initialValues });
    classWiseDocumentsList({ ...initialValues });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    classWiseDocumentsList(paginationInfo);
  }

  const { content: masterDocumentsResp, totalElements, totalPages, pageable } = getClassWiseDocumentsListResp || {};
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Admissions" pageTitle="Admissions" />

          <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-6">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">Class Wise Documents</h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <form>
                <div className="tw-grid tw-gap-3 tw-px-3 tw-pt-3 tw-grid-cols-1 md:tw-grid-cols-1 lg:tw-grid-cols-7 xl:tw-grid-cols-7">

                  {/* Search Box */}
                  <div className="tw-col-span-1 lg:tw-col-span-3 xl:tw-col-span-3">
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

                  {/* Academic Year */}
                  <div className="tw-col-span-1 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={masterDocuments.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  {/* Curriculum */}
                  <div className="tw-col-span-1 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={masterDocuments.curriculumId}
                      onChange={filterHandler}
                      menuItems={brchCurriculumResp?.data || []}
                      formgroupClassName="tw-mb-0"
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>

                  {/* Clear Filter */}
                  {showClearFilterState && (
                    <div className="tw-col-auto tw-ml-auto tw-flex tw-mb-3">
                      <Button
                        type="button"
                        variant="wrong"
                        onClick={clearFilterHndlr}
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
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
        id="extension-details"
        isOpen={viewNoOfExtensionModalState.showModal}
        toggle={closeViewNoOfExtensionModal}
        modalTitle="Class Extensions Details"
        modalSize="xl"
      >
        <ExtensionDetailsModel
          isOpen={viewNoOfExtensionModalState.showModal}
          toggle={closeViewNoOfExtensionModal}
          modalTitle="Extension Details"
          modalData={viewNoOfExtensionModalState.modalData}
          classWiseDocumentsList={classWiseDocumentsList}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="extension-details"
        isOpen={assignDocModalState.showModal}
        toggle={closeAssignDocModal}
        modalTitle="Class Assign Details"
        modalSize="xl"
      >
        <AssignDocumentModel
          isOpen={assignDocModalState.showModal}
          toggle={closeAssignDocModal}
          modalTitle="Assign Document"
          modalData={assignDocModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ClassWiseDocuments;
