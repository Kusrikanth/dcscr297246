import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { useModal } from "../../../../hooks/modalhook";
import PeriodCategoryModal from "./PeriodCategoryModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deletePeriodCategoryAct, getPeriodCategoryAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../utility/commonutility";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFilterState } from "../../../../hooks/filterhook";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  categoryName: "",
}
const PeriodCategory = () => {
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  
   const pagination = useRef({
      pageNo: 0,
      pageSize: 10
    })
  const {
    closeModal: closePeriodCategoryModal,
    openModal: openPeriodCategoryModal,
    modalState: periodCategoryModalState,
  } = useModal();

  const {
    closeModal: closeDeletePeriodCategoryModal,
    openModal: openDeletePeriodCategoryModal,
    modalState: deletePeriodCategoryModalState,
  } = useModal();

  const getPeriodCategoryApiCall = (otherProps?: any) => {
    const payload = {
      ...pagination.current,
      ...otherProps
    }
    dispatch(getPeriodCategoryAct(generateActionPayload("get_period_category", undefined, payload)));

  }

  const {
    getPeriodCategoryResp,
    deletePeriodCategoryResp,
    savePeriodCategoryResp,
    getTimeTableErrResp,
    updatePeriodCategoryResp,
  } = useAppSelector(
    ({ timeTableManagement }) => ({
      getPeriodCategoryResp: timeTableManagement.getPeriodCategoryResp,
      deletePeriodCategoryResp: timeTableManagement.deletePeriodCategoryResp,
      savePeriodCategoryResp: timeTableManagement.savePeriodCategoryResp,
      getTimeTableErrResp: timeTableManagement.getTimeTableErrResp,
      updatePeriodCategoryResp: timeTableManagement.updatePeriodCategoryResp,
    }),
    shallowEqual
  );

   const periodCategoryRef = useRef({
     prevDeletePeriodCategoryResp : deletePeriodCategoryResp,
     prevSavePeriodCategoryResp: savePeriodCategoryResp,
     prevGetTimeTableErrResp: getTimeTableErrResp,
     prevUpdatePeriodCategoryResp: updatePeriodCategoryResp,
    })

    useEffect(() => {
      const { prevDeletePeriodCategoryResp, prevSavePeriodCategoryResp, prevGetTimeTableErrResp, prevUpdatePeriodCategoryResp } = periodCategoryRef.current;

      if (deletePeriodCategoryResp && prevDeletePeriodCategoryResp !== deletePeriodCategoryResp) {
        toast.success("Period Category Deleted Successfully")
        closeDeletePeriodCategoryModal()
        getPeriodCategoryApiCall()
      }
      else if (savePeriodCategoryResp && prevSavePeriodCategoryResp !== savePeriodCategoryResp) {
        toast.success("Period Category Saved Successfully")
        closePeriodCategoryModal()
        getPeriodCategoryApiCall()
      }
      else if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
        const {details} = getTimeTableErrResp;
        toast.error(details || "Something went wrong.")
      }
      else if (updatePeriodCategoryResp && prevUpdatePeriodCategoryResp !== updatePeriodCategoryResp) {
        toast.success("Period Category Updated Successfully")
        closePeriodCategoryModal()
        getPeriodCategoryApiCall()
      }
  
      periodCategoryRef.current.prevDeletePeriodCategoryResp = deletePeriodCategoryResp;  
      periodCategoryRef.current.prevSavePeriodCategoryResp = savePeriodCategoryResp; 
      periodCategoryRef.current.prevGetTimeTableErrResp = getTimeTableErrResp; 
      periodCategoryRef.current.prevUpdatePeriodCategoryResp = updatePeriodCategoryResp;
    }, [getTimeTableErrResp, deletePeriodCategoryResp, savePeriodCategoryResp, updatePeriodCategoryResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openPeriodCategoryModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeletePeriodCategoryModal(id);
        },
      },
    ],
    []
  );

   const periodCategoryForm = useFormik({
      initialValues,
      onSubmit: (values) => {},
    });
  

  useEffect(() => {
    getPeriodCategoryApiCall();
  }, []);

  function paginationHndlr(paginationInfo: IPaginationState) {
      pagination.current = paginationInfo;
      getPeriodCategoryApiCall(paginationInfo)
    }

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

   function delModalSubmitHndlr() {
      dispatch(deletePeriodCategoryAct(generateActionPayload("delete_period_category", { id: deletePeriodCategoryModalState.modalData })));
    }

  function search(value: string) {
    getPeriodCategoryApiCall({ ...periodCategoryForm.values, categoryName: value });
  }
  const debounceFun = useCallback(debounce(search, 200), [getPeriodCategoryResp]);
  

  const filterChangeHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "categoryName") {
      periodCategoryForm.setValues((prev: any) => ({ ...prev, [name]: value }));
      debounceFun(value);
    }
    else{
      periodCategoryForm.setValues((prev: any) => ({ ...prev, [name]: value }));
      getPeriodCategoryApiCall({ [name]: value });
    }
  };
  const clearFilterHndlr = () => {
        pagination.current = { ...pagination.current, pageNo: 0 }
        periodCategoryForm.setValues({ ...initialValues })
        getPeriodCategoryApiCall({ ...initialValues })
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
  };

  const { data: periodCategoryData, pageNumber, totalPages, totalElements } = getPeriodCategoryResp || {};


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Period Category"
            pageTitle="Period Category"
          />
        </div>

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">
          <div className="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
              Period Category
            </h4>

            <Button
              onClick={() => openPeriodCategoryModal()}
              variant="primary"
            >
              <i className="ri-add-line"></i>
              Add New
            </Button>
          </div>

          <div className="">
            <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4 tw-items-start lg:tw-items-end">

              <div className="tw-w-full lg:tw-w-80 tw-relative tw-p-5">
                <div className="search-box">
                  <TextInput
                    name="categoryName"
                    formgroupClassName="mb-0"
                    placeHolder="Search"
                    value={periodCategoryForm.values.categoryName}
                    onChange={filterChangeHndlr}
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                </div>
              </div>

              {showClearFilterState && (
                <div className="tw-ml-auto">
                  <Button
                    type="button"
                    onClick={clearFilterHndlr}
                    variant="wrong"
                  >
                    Clear Filter
                  </Button>
                </div>
              )}

            </div>

            <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-overflow-hidden">
              <TableContainer
                columns={tableColumns || []}
                data={periodCategoryData || []}
                tableClass="tw-min-w-full"
                divClass="tw-overflow-x-auto"
                theadClass="tw-bg-gray-100 tw-text-gray-600"
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
        id="periodCategoryModal"
        isOpen={periodCategoryModalState.showModal}
        toggle={closePeriodCategoryModal}
        modalTitle={
          periodCategoryModalState.modalData
            ? "Edit Period Category"
            : "Add Period Category"
        }
        modalSize="md"
      >
        <PeriodCategoryModal
          toggle={() => closePeriodCategoryModal()}
          isOpen={periodCategoryModalState.showModal}
          modalData={periodCategoryModalState.modalData}
        ></PeriodCategoryModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-period-category"
        isOpen={deletePeriodCategoryModalState.showModal}
        confirmMessage="Are you sure you want to delete a Period Category"
        cancelHndlr={closeDeletePeriodCategoryModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default PeriodCategory;
