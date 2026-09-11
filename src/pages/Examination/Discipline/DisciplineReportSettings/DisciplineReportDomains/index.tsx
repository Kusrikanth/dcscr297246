import React, { useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { generateColumns } from "./helper";
import { delDisciplineSettingsDomainItemByIdAct, getDisciplineSettingsDomainItemByIdAct, getDisciplineSettingsDomainsAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";
import AddEditDomainModal from "./AddEditDomainModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
};

const DisciplineReportDomains = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditDomainOpenModal,
    closeModal: addEditDomainCloseModal,
    modalState: addEditDomainModalState,
  } = useModal();
  const {
    openModal: delDomainOpenModal,
    closeModal: delDomainCloseModal,
    modalState: delDomainModalState,
  } = useModal();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    getDisciplineSettingsDomainsResp,
    saveDisciplineSettingsDomainItemByIdResp,
    updateDisciplineSettingsDomainItemByIdResp,
    delDisciplineSettingsDomainItemByIdResp,
    pvaReportsErrorAct,
  } = useAppSelector(
    ({ appData, instAcademics, pvaReports }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      getDisciplineSettingsDomainsResp:
        pvaReports.getDisciplineSettingsDomainsResp,
      saveDisciplineSettingsDomainItemByIdResp:
        pvaReports.saveDisciplineSettingsDomainItemByIdResp,
      updateDisciplineSettingsDomainItemByIdResp:
        pvaReports.updateDisciplineSettingsDomainItemByIdResp,
      delDisciplineSettingsDomainItemByIdResp: pvaReports.delDisciplineSettingsDomainItemByIdResp,
      currentInstIdResp: appData.currentInstIdResp,

     pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,
    }),
    shallowEqual
  );

  const filterFormik = useFormik({
    initialValues,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditDomainOpenModal(id);
          dispatch(
            getDisciplineSettingsDomainItemByIdAct(
              generateActionPayload("get_discipline_settings_domain_item_by_id", { id: id })
            )
          );
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delDomainOpenModal(id);
        },
      },
    ],
    [dispatch, addEditDomainOpenModal, delDomainOpenModal]
  );

  function fetchDisciplineDomainsList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: filterFormik.values.academicYearId,
      ...paginationRef.current,
      ...otherProps,
      orderBy: "asc",
    };

    dispatch(
      getDisciplineSettingsDomainsAct(
        generateActionPayload("get_discipline_settings_domains", undefined, payload)
      )
    );
  }

  function delDisciplineDomainItem() {
    dispatch(
      delDisciplineSettingsDomainItemByIdAct(
        generateActionPayload("del_discipline_settings_domain_item_by_id", {
          id: delDomainModalState.modalData,
        })
      )
    );
  }

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchDisciplineDomainsList(paginationInfo);
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      filterFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchDisciplineDomainsList({ [name]: value });
    } else if (name === "searchString") {
      filterFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchDisciplineDomainsList({ [name]: value });
    }
  };

  const attributeSportsRef = useRef({
    prevSaveDisciplineSettingsDomainItemByIdResp: saveDisciplineSettingsDomainItemByIdResp,
    prevUpdateDisciplineSettingsDomainItemByIdResp: updateDisciplineSettingsDomainItemByIdResp,
    prevDelDisciplineSettingsDomainItemByIdResp: delDisciplineSettingsDomainItemByIdResp,
    prevPvaReportsErrorAct: pvaReportsErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveDisciplineSettingsDomainItemByIdResp,
      prevUpdateDisciplineSettingsDomainItemByIdResp,
      prevDelDisciplineSettingsDomainItemByIdResp,
      prevPvaReportsErrorAct,
    } = attributeSportsRef.current;

    if (
      saveDisciplineSettingsDomainItemByIdResp &&
      saveDisciplineSettingsDomainItemByIdResp !== prevSaveDisciplineSettingsDomainItemByIdResp
    ) {
      toast.success("Domain added successfully");
      fetchDisciplineDomainsList();
      addEditDomainCloseModal();
    } else if (
      updateDisciplineSettingsDomainItemByIdResp &&
      updateDisciplineSettingsDomainItemByIdResp !== prevUpdateDisciplineSettingsDomainItemByIdResp
    ) {
      toast.success("Domain updated successfully");
      fetchDisciplineDomainsList();
      addEditDomainCloseModal();
    } else if (
      delDisciplineSettingsDomainItemByIdResp &&
      delDisciplineSettingsDomainItemByIdResp !== prevDelDisciplineSettingsDomainItemByIdResp
    ) {
      delDomainCloseModal();
      toast.success("Domain deleted successfully");
      fetchDisciplineDomainsList();
    } else if (
      pvaReportsErrorAct &&
      pvaReportsErrorAct !== prevPvaReportsErrorAct
    ) {
      const { details } = pvaReportsErrorAct;
      toast.error(details || "Something went wrong");
    }

    attributeSportsRef.current.prevSaveDisciplineSettingsDomainItemByIdResp =
      saveDisciplineSettingsDomainItemByIdResp;
    attributeSportsRef.current.prevUpdateDisciplineSettingsDomainItemByIdResp =
      updateDisciplineSettingsDomainItemByIdResp;
    attributeSportsRef.current.prevDelDisciplineSettingsDomainItemByIdResp =
      delDisciplineSettingsDomainItemByIdResp;
    attributeSportsRef.current.prevPvaReportsErrorAct =
      pvaReportsErrorAct;
  }, [
    saveDisciplineSettingsDomainItemByIdResp,
    updateDisciplineSettingsDomainItemByIdResp,
    delDisciplineSettingsDomainItemByIdResp,
    pvaReportsErrorAct,
  ]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    filterFormik.setFieldValue("academicYearId", yearId);
    fetchDisciplineDomainsList({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const { data: academicYearList } = academicYearListResp || {};
  const {
    content: domainsList,
    totalElements,
    totalPages,
    pageable,
  } = getDisciplineSettingsDomainsResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Manage Domains
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={filterFormik.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => addEditDomainOpenModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(domainsList)
                    ? domainsList
                    : []
                }
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="addEditDomainModal"
        isOpen={addEditDomainModalState.showModal}
        toggle={addEditDomainCloseModal}
        modalTitle={
          addEditDomainModalState.modalData
            ? "Edit domains"
            : "Add domains"
        }
        modalSize="lg"
      >
        <AddEditDomainModal
          isOpen={addEditDomainModalState.showModal}
          toggle={addEditDomainCloseModal}
          editItemId={addEditDomainModalState.modalData}
        ></AddEditDomainModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delDomainModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sports Attribute?"
        cancelHndlr={delDomainCloseModal}
        confirmHndlr={delDisciplineDomainItem}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default DisciplineReportDomains;
