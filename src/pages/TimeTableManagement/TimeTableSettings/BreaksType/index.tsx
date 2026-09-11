import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deleteBreaksTypeAct, getBreaksTypeAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../utility/commonutility";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFilterState } from "../../../../hooks/filterhook";
import { toast } from "react-toastify";
import BreaksTypeModal from "./BreaksTypeModal";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  breakType: "",
}
const BreaksType = () => {
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const {
    closeModal: closeBreaksTypeModal,
    openModal: openBreaksTypeModal,
    modalState: breaksTypeModalState,
  } = useModal();

  const {
    closeModal: closeDeleteBreaksTypeModal,
    openModal: openDeleteBreaksTypeModal,
    modalState: deleteBreaksTypeModalState,
  } = useModal();

  const getBreaksTypeApiCall = (otherProps?: any) => {
    const payload = {
      ...pagination.current,
      ...otherProps
    }
    dispatch(getBreaksTypeAct(generateActionPayload("get_breaks_type", undefined, payload)));

  }

  const {
    getBreaksTypeResp,
    deleteBreaksTypeResp,
    saveBreaksTypeResp,
    getTimeTableErrResp,
    updateBreaksTypeResp,
  } = useAppSelector(
    ({ timeTableManagement }) => ({
      getBreaksTypeResp: timeTableManagement.getBreaksTypeResp,
      deleteBreaksTypeResp: timeTableManagement.deleteBreaksTypeResp,
      saveBreaksTypeResp: timeTableManagement.saveBreaksTypeResp,
      getTimeTableErrResp: timeTableManagement.getTimeTableErrResp,
      updateBreaksTypeResp: timeTableManagement.updateBreaksTypeResp,
    }),
    shallowEqual
  );

  const periodCategoryRef = useRef({
    prevDeleteBreaksTypeResp: deleteBreaksTypeResp,
    prevSaveBreaksTypeResp: saveBreaksTypeResp,
    prevGetTimeTableErrResp: getTimeTableErrResp,
    prevUpdateBreaksTypeResp: updateBreaksTypeResp,
  })

  useEffect(() => {
    const { prevDeleteBreaksTypeResp, prevSaveBreaksTypeResp, prevGetTimeTableErrResp, prevUpdateBreaksTypeResp } = periodCategoryRef.current;

    if (deleteBreaksTypeResp && prevDeleteBreaksTypeResp !== deleteBreaksTypeResp) {
      toast.success("Breaks Type Deleted Successfully")
      closeDeleteBreaksTypeModal()
      getBreaksTypeApiCall()
    }
    else if (saveBreaksTypeResp && prevSaveBreaksTypeResp !== saveBreaksTypeResp) {
      toast.success("Breaks Type Saved Successfully")
      closeBreaksTypeModal()
      getBreaksTypeApiCall()
    }
    else if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
      const { details } = getTimeTableErrResp;
      toast.error(details || "Something went wrong.")
    }
    else if (updateBreaksTypeResp && prevUpdateBreaksTypeResp !== updateBreaksTypeResp) {
      toast.success("Breaks Type Updated Successfully")
      closeBreaksTypeModal()
      getBreaksTypeApiCall()
    }

    periodCategoryRef.current.prevDeleteBreaksTypeResp = deleteBreaksTypeResp;
    periodCategoryRef.current.prevSaveBreaksTypeResp = saveBreaksTypeResp;
    periodCategoryRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
    periodCategoryRef.current.prevUpdateBreaksTypeResp = updateBreaksTypeResp;
  }, [getTimeTableErrResp, deleteBreaksTypeResp, saveBreaksTypeResp, updateBreaksTypeResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openBreaksTypeModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeleteBreaksTypeModal(id);
        },
      },
    ],
    []
  );

  const breaksTypeForm = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });


  useEffect(() => {
    getBreaksTypeApiCall();
  }, []);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getBreaksTypeApiCall(paginationInfo)
  }

  

  function delModalSubmitHndlr() {
    dispatch(deleteBreaksTypeAct(generateActionPayload("delete_breaks_type", { id: deleteBreaksTypeModalState.modalData })));
  }

  function search(value: string) {
    getBreaksTypeApiCall({ ...breaksTypeForm.values, breakType: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getBreaksTypeResp]);

  const filterChangeHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "breakType") {
      breaksTypeForm.setValues((prev: any) => ({ ...prev, [name]: value }));
      debounceFun(value);
    }
    else {
      breaksTypeForm.setValues((prev: any) => ({ ...prev, [name]: value }));
      getBreaksTypeApiCall({ [name]: value });
    }
    advanceFilterChange({
          keys: { ...breaksTypeForm.values, [name]: value },
          ignoredKeys: [],
        });
  };

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 }
    breaksTypeForm.setValues({ ...initialValues })
    getBreaksTypeApiCall({ ...initialValues })
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
  };

  const tableColumns = useMemo(() => generateColumns(menuOptions),[menuOptions]);

  const { data: BreaksTypeData, pageNumber, totalPages, totalElements } = getBreaksTypeResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Breaks Type"
            pageTitle="Time Table Management"
          />
        </div>

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

          <div className="tw-flex tw-items-center tw-justify-between tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
              Breaks Type
            </h4>

            <Button
              onClick={() => openBreaksTypeModal()}
              variant="primary"
            >
              <i className="ri-add-line"></i>
              Add New
            </Button>
          </div>

          <div className="tw-p-0">

            <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4 tw-items-start lg:tw-items-end tw-p-5">

              <div className="tw-w-full lg:tw-w-80 search-box tw-relative">
                <TextInput
                  name="breakType"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  value={breaksTypeForm.values.breakType}
                  onChange={filterChangeHndlr}
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
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
                data={BreaksTypeData || []}
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
        id="BreaksTypeModal"
        isOpen={breaksTypeModalState.showModal}
        toggle={closeBreaksTypeModal}
        modalTitle={
          breaksTypeModalState.modalData
            ? "Edit Breaks Type"
            : "Add Breaks Type"
        }
        modalSize="md"
      >
        <BreaksTypeModal
          toggle={() => closeBreaksTypeModal()}
          isOpen={breaksTypeModalState.showModal}
          modalData={breaksTypeModalState.modalData}
        ></BreaksTypeModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-period-category"
        isOpen={deleteBreaksTypeModalState.showModal}
        confirmMessage="Are you sure you want to delete a breaks type?"
        cancelHndlr={closeDeleteBreaksTypeModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default BreaksType;
