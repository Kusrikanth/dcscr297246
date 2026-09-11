import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getSortingKeys } from "../../../../utility/commonutility";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import AddFeeFineModal from "./AddFeeFineModal";
import { delHostelFeeFineAct, getHostelFeeFineListAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import { useModal } from "../../../../hooks/modalhook";
import { useFilterState } from "../../../../hooks/filterhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
}
const HostelFeeFine: React.FC<any> = () => {
  
  const {
    closeModal: closeAddHostelFeeFineModal,
    modalState: addHostelFeeFineModal,
      openModal: openAddHostelFeeFineModal,
    } = useModal();
    
    const {
      closeModal: closeDelHostelFeeFineModal,
      modalState: delHostelFeeFineModal,
      openModal: openDelHostelFeeFineModal,
    } = useModal();
    
    const [filterState, setFilterState] = useState(initialValues);
    const { showClearFilterState, advanceFilterChange } = useFilterState();
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef(undefined);

  const dispatch = useAppDispatch();
  const {  deleteHostelFeeFinesResp,
    currentInstIdResp: instituteId, academicYearListResp, currentBranchIdResp: branchId,getHostelFeeFinesListResp,hostelStuLedgerErrResp } =
    useAppSelector(({ appData, instAcademics, globalData,hostelStuLedger }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getHostelFeeFinesListResp: hostelStuLedger.getHostelFeeFinesListResp,
      deleteHostelFeeFinesResp: hostelStuLedger.deleteHostelFeeFinesResp,
      hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp
    }), shallowEqual);    

  const feeDetailsRespRef = useRef<any>({
    prevDeleteHostelFeeFinesResp: deleteHostelFeeFinesResp,
    prevHostelStuLedgerErrResp: hostelStuLedgerErrResp
  });

  useEffect(() => {
    const { prevDeleteHostelFeeFinesResp, prevHostelStuLedgerErrResp } = feeDetailsRespRef.current;
    if (deleteHostelFeeFinesResp && prevDeleteHostelFeeFinesResp !== deleteHostelFeeFinesResp) {
      getFeeFinesApiCall();
      toast.success("Fee fine deleted successfully.");
      closeDelHostelFeeFineModal();
    } else if (hostelStuLedgerErrResp && hostelStuLedgerErrResp !== prevHostelStuLedgerErrResp) {
      const { details, message }: any = hostelStuLedgerErrResp;
      toast.error(details || message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevDeleteHostelFeeFinesResp = deleteHostelFeeFinesResp;
    feeDetailsRespRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;
  }, [deleteHostelFeeFinesResp, hostelStuLedgerErrResp]);


  useEffect(() => {
    if (!instituteId) return;
    if (!academicYearListResp) {
      const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    } else {
      const { data } = academicYearListResp || {};
      if (Array.isArray(data)) {
        let yearId = data.find((year: any) => year.isAdmissionDefault)?.academicYearId;
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
        getFeeFinesApiCall({ academicYearId: yearId });
      }
    }
  }, [branchId,instituteId, academicYearListResp]);

  function addFeeFineHndlr() {
    openAddHostelFeeFineModal({ feeFineId: "", modalData: undefined });
  }

  function editFeeFineHndlr(event: any) {
    const feeFineId = event.currentTarget.getAttribute("data-id");
    const modalData = getHostelFeeFinesListResp?.find((item: any) => item.id == feeFineId);
    openAddHostelFeeFineModal({ feeFineId, modalData });
  }

  const menuOptions = useMemo((): IOptionsHrtl[] => ([{
    id: "edit",
    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
    actionName: "Edit",
    onClickHndlr: editFeeFineHndlr,
  }, {
    id: "delete",
    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
    actionName: "Delete",
    onClickHndlr: (event: any) => {
      const id = event.currentTarget.getAttribute("data-id");
      openDelHostelFeeFineModal(id);
    },
  }]), [getHostelFeeFinesListResp]);
  
  function delModalSubmitHndlr() {
    dispatch(delHostelFeeFineAct(generateActionPayload("delete_hostel_fee_fine", { id: delHostelFeeFineModal.modalData })))
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeFinesApiCall(paginationInfo);
  }

  function getFeeFinesApiCall(otherProps?: any) {
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = { instituteId, branchId, ...filterState, ...otherProps, ...sortingParams };
    dispatch(getHostelFeeFineListAct(generateActionPayload("get_hostel_fee_fine_list", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeFinesApiCall({ [name]: value });
    advanceFilterChange({ keys : { ...filterState, [name]: value} , ignoredKeys:[]})
  }
  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || { academicYearId: "" };
      setFilterState({ ...initialValues, academicYearId });
      getFeeFinesApiCall({ ...initialValues, academicYearId });
     advanceFilterChange({ keys : { ...initialValues } , ignoredKeys:[]})
    }
  }

  const feeParticularColumns = useMemo(() => {
    const { pageNo, pageSize } = paginationDetailRef.current,
      offset = pageNo * pageSize;
    return generateColumns(menuOptions, offset)
  }, [getHostelFeeFinesListResp]),
    { pageNumber, totalPages, totalElements } = getHostelFeeFinesListResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fines" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-px-6 tw-py-2 tw-border-b tw-border-gray-200">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-items-center">
                <div className="tw-col-span-1">
                  <h4 className="tw-text-lg tw-mb-0 tw-flex-grow">
                    Hostel Fee Fines
                  </h4>
                </div>
                <div className="tw-col-span-1 tw-flex tw-justify-end">
                  <Button
                    variant="primary"
                    onClick={addFeeFineHndlr}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3">
                  <div className="tw-col-span-1 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>

                  <div className="tw-col-span-1 lg:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={filterState.academicYearId}
                      onChange={onChangeFilterHndlr}
                      menuItems={academicYearListResp?.data}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>
                  {showClearFilterState && (
                      <div className='tw-col-span-1 tw-flex tw-ml-auto'>

                      <Button
                        type="button"
                        onClick={clearFilterHndlr}
                        variant="wrong"
                      >
                        Clear filter
                      </Button>
                      </div>
                    )}
                </div>
              </div>
              <TableContainer
                columns={feeParticularColumns || []}
                data={Array.isArray(getHostelFeeFinesListResp) ? getHostelFeeFinesListResp : []}
                divClass="tw-overflow-x-auto tw-mb-1"
                tableClass="tw-whitespace-nowrap"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                // showCheckbox={true}
                showPagination={false}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
                manualSorting={true}
              />
            </div>
          </div>

        </div>
      </div>


      <ModalContainerUpdated
        id="add-fine-modal"
        isOpen={addHostelFeeFineModal.showModal}
        toggle={closeAddHostelFeeFineModal}
        modalTitle={addHostelFeeFineModal.modalData?.feeFineId ? "Update Fine" : "Create Fine"}
        modalSize="md"
      >
        <AddFeeFineModal
          toggle={closeAddHostelFeeFineModal}
          instituteId={instituteId}
          branchId={branchId}
          feeFineId={addHostelFeeFineModal.modalData?.feeFineId}
          editFeeFineDetails={addHostelFeeFineModal.modalData?.modalData}
          getFeeFinesApiCall={getFeeFinesApiCall}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-fine-modal"
        isOpen={delHostelFeeFineModal.showModal}
        confirmMessage="Are you sure you want to delete this fee fine?"
        cancelHndlr={closeDelHostelFeeFineModal}
        confirmHndlr={delModalSubmitHndlr}

      />
    </>
  );
};

export default HostelFeeFine;

