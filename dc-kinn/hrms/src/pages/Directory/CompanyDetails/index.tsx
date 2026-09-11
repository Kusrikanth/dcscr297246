import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import CompanyDetailsModel from "./CompanyDetailsModel";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import {
  getAllCompaniesListAct,
  deleteCompanyDetailsListAct,
  getCompanyDetailsListByIdAct,
} from "../../../store/directory/employeemanagement/employeemanagementactions";
import { useModal } from "../../../hooks/modalhook";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const CompanyDetails = () => {
  const dispatch = useDispatch();
  const [companyDetails, setCompanyDetails] = useState(initialValues);
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const companyDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: companyDetails,
    onSubmit: (values) => {},
  });

  const {
    modalState: companyDetailsModalState,
    closeModal: closeCompanyDetailsModalHdnlr,
    openModal: openCompanyDetailsModalHdnlr,
  } = useModal();
  const {
    modalState: delCompanyDetailsModalState,
    closeModal: closeDelCompanyDetailsModalHdnlr,
    openModal: openDelCompanyDetailsModalHdnlr,
  } = useModal();

  const delCompanyDetailsConfirmHndler = () => {
    dispatch(
      deleteCompanyDetailsListAct(
        generateActionPayload("delete_company_details_list", {
          id: delCompanyDetailsModalState.modalData,
        })
      )
    );
  };

  const companyDetailsList = (otherProps?: any) => {
    const { searchString } = companyDetails;
    let payload = {
      instituteId,
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(
      getAllCompaniesListAct(
        generateActionPayload("get_all_complanies", undefined, payload)
      )
    );
  };
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getAllCompaniesllListResp,
    saveCompanyDetailsListResp,
    editCompanyDetailRequestResp,
    delCompanyDetailsRequestResp,
    employeeManagementErrorResp,
  } = useAppSelector(({ directoryEmployee, appData, globalData }) => {
    return {
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
      saveCompanyDetailsListResp: directoryEmployee.saveCompanyDetailsListResp,
      editCompanyDetailRequestResp:
        directoryEmployee.editCompanyDetailsRequestResp,
      delCompanyDetailsRequestResp:
        directoryEmployee.delCompanyDetailsRequestResp,
      employeeManagementErrorResp:
        directoryEmployee.employeeManagementErrorResp,
    };
  }, shallowEqual);

  const companyDetailsRef = useRef({
    prevAddCompanyDetails: saveCompanyDetailsListResp,
    prevEditCompanyDetails: editCompanyDetailRequestResp,
    prevDeleteCompanyDetailsRequestListResp: delCompanyDetailsRequestResp,
    prevEmployeeManagementErrorResp: employeeManagementErrorResp,
  });

  useEffect(() => {
    const {
      prevAddCompanyDetails,
      prevEditCompanyDetails,
      prevDeleteCompanyDetailsRequestListResp,
      prevEmployeeManagementErrorResp,
    } = companyDetailsRef.current;
    if (
      saveCompanyDetailsListResp &&
      prevAddCompanyDetails !== saveCompanyDetailsListResp
    ) {
      toast.success("Company added successfully.");
      closeCompanyDetailsModalHdnlr();
      companyDetailsList();
    } else if (
      editCompanyDetailRequestResp &&
      prevEditCompanyDetails !== editCompanyDetailRequestResp
    ) {
      toast.success("Company Details updated successfully.");
      closeCompanyDetailsModalHdnlr();
      companyDetailsList();
    } else if (
      delCompanyDetailsRequestResp &&
      prevDeleteCompanyDetailsRequestListResp !== delCompanyDetailsRequestResp
    ) {
      toast.success("Company deleted successfully.");
      closeDelCompanyDetailsModalHdnlr();
      companyDetailsList();
    } else if (
      employeeManagementErrorResp &&
      prevEmployeeManagementErrorResp !== employeeManagementErrorResp
    ) {
      const { details } = employeeManagementErrorResp;
      toast.error(details);
    }
    companyDetailsRef.current.prevDeleteCompanyDetailsRequestListResp =
      delCompanyDetailsRequestResp;
    companyDetailsRef.current.prevEditCompanyDetails =
      editCompanyDetailRequestResp;
    companyDetailsRef.current.prevAddCompanyDetails =
      saveCompanyDetailsListResp;
    companyDetailsRef.current.prevEmployeeManagementErrorResp =
      employeeManagementErrorResp;
  }, [
    saveCompanyDetailsListResp,
    editCompanyDetailRequestResp,
    delCompanyDetailsRequestResp,
    employeeManagementErrorResp,
  ]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getCompanyDetailsListByIdAct(
              generateActionPayload("get_company_details_list_by_id", {
                id: id,
              })
            )
          );
          openCompanyDetailsModalHdnlr(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelCompanyDetailsModalHdnlr(id);
        },
      },
    ],
    []
  );

  useEffect(() => {
    companyDetailsList();
  }, []);

  const filterHandler = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    companyDetailsList({ [name]: value });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    companyDetailsList(paginationInfo);
  }

  const {
    data: companyDetailsResp,
    totalElements,
    totalPages,
    pageable,
  } = getAllCompaniesllListResp || {};

  const columns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions, companyDetailsResp]
  );
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Company Details" pageTitle="HRMS" />

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-mb-4">

            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Company Details
              </h4>
            </div>

            <div className=" tw-space-y-6">

              <form onSubmit={companyDetailsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-items-center tw-px-6 tw-pt-3">
                  <div className="tw-relative lg:tw-col-span-4">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      floatingLabel
                      placeHolder="Search"
                      value={companyDetailsForm.values.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                  </div>

                  <div className="lg:tw-col-span-8 tw-flex tw-justify-end">
                    <Button
                      type="button"
                      onClick={() => openCompanyDetailsModalHdnlr()}
                      variant="primary"
                    >
                      <i className="ri-add-line" />
                      Add New
                    </Button>
                  </div>

                </div>
              </form>

              <TableContainer
                columns={columns || []}
                data={companyDetailsResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
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
        id="company-details-modal"
        isOpen={companyDetailsModalState.showModal}
        toggle={() => closeCompanyDetailsModalHdnlr()}
        modalTitle={
          companyDetailsModalState.modalData
            ? "Edit Company Details"
            : "Create Details"
        }
        modalSize="md"
      >
        <CompanyDetailsModel
          id={companyDetailsModalState.modalData}
          toggle={() => closeCompanyDetailsModalHdnlr()}
          modalTitle="Create Company Details"
          isOpen={false}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-company-details-modal"
        isOpen={delCompanyDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Company Details ?"
        cancelHndlr={() => closeDelCompanyDetailsModalHdnlr()}
        confirmHndlr={delCompanyDetailsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default CompanyDetails;
