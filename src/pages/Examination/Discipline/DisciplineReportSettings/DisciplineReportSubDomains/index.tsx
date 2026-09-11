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

import { delDisciplineSettingsDomainItemByIdAct, delDisciplineSettingsSybDomainItemByIdAct, getDisciplineSettingsDomainItemByIdAct, getDisciplineSettingsDomainsAct, getDisciplineSettingsSubDomainItemByIdAct, getDisciplineSettingsSubDomainsAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";
import { generateColumns } from "./helper";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import AddEditSubDomainModal from "./AddEditSubDomainModal";


const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId:"",
  classId:""
};

const DisciplineReportSubDomains = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditSubDomainOpenModal,
    closeModal: addEditSubDomainCloseModal,
    modalState: addEditSubDomainModalState,
  } = useModal();
  const {
    openModal: delSubDomainOpenModal,
    closeModal: delSubDomainCloseModal,
    modalState: delSubDomainModalState,
  } = useModal();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    academicYearListResp,
    getDisciplineSettingsSubDomainsResp,
    saveDisciplineSettingsSubDomainItemByIdResp,
    updateDisciplineSettingsSubDomainItemByIdResp,
    delDisciplineSettingsSybDomainItemByIdResp,
    pvaReportsErrorAct,
  } = useAppSelector(
    ({ appData, instAcademics, pvaReports, branchAcademics }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,

      getDisciplineSettingsSubDomainsResp:
        pvaReports.getDisciplineSettingsSubDomainsResp,
      saveDisciplineSettingsSubDomainItemByIdResp:
        pvaReports.saveDisciplineSettingsSubDomainItemByIdResp,
      updateDisciplineSettingsSubDomainItemByIdResp:
        pvaReports.updateDisciplineSettingsSubDomainItemByIdResp,
      delDisciplineSettingsSybDomainItemByIdResp: pvaReports.delDisciplineSettingsSybDomainItemByIdResp,
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
          addEditSubDomainOpenModal(id);
          dispatch(
            getDisciplineSettingsSubDomainItemByIdAct(
              generateActionPayload("update_sub_discipline_settings_domain_item_by_id", { id: id })
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
          delSubDomainOpenModal(id);
        },
      },
    ],
    [dispatch, addEditSubDomainOpenModal, delSubDomainOpenModal]
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: filterFormik.values?.academicYearId, curriculumId: filterFormik.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function fetchSubDisciplineDomainsList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: filterFormik.values.academicYearId,
      ...paginationRef.current,
      ...otherProps,
    };

    dispatch(
      getDisciplineSettingsSubDomainsAct(
        generateActionPayload("get_sub_discipline_settings_domains", undefined, payload)
      )
    );
  }

  function delSubDisciplineDomainItem() {
    dispatch(
      delDisciplineSettingsSybDomainItemByIdAct(
        generateActionPayload("del_sub_discipline_settings_domain_item_by_id", {
          id: delSubDomainModalState.modalData,
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
    fetchSubDisciplineDomainsList(paginationInfo);
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
        filterFormik.setValues((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        fetchSubDisciplineDomainsList({ [name]: value });
        if(!value){
            dispatch(resetBrchCurriculumAct(undefined))
        }else {
            getCurriculumApiCall({ academicYearId: value });
        }
    } else if(name === 'curriculumId'){
        filterFormik.setValues((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        fetchSubDisciplineDomainsList({ [name]: value });
        if(!value){
            dispatch(resetBrchClassAct(undefined))
        }
        else {
            getClassApiCall({ curriculumId: value, academicYearId: filterFormik.values.academicYearId });
        }
    }
    else if(name === 'classId'){
        filterFormik.setValues((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        getClassApiCall({ classId: value});
        fetchSubDisciplineDomainsList({ [name]: value });
    } 
    
    else if (name === "searchString") {
      filterFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSubDisciplineDomainsList({ [name]: value });
    }
  };

  const attributeSportsRef = useRef({
    prevSaveDisciplineSettingsSubDomainItemByIdResp: saveDisciplineSettingsSubDomainItemByIdResp,
    prevUpdateDisciplineSettingsSubDomainItemByIdResp: updateDisciplineSettingsSubDomainItemByIdResp,
    prevDelDisciplineSettingsSybDomainItemByIdResp: delDisciplineSettingsSybDomainItemByIdResp,
    prevPvaReportsErrorAct: pvaReportsErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveDisciplineSettingsSubDomainItemByIdResp,
      prevUpdateDisciplineSettingsSubDomainItemByIdResp,
      prevDelDisciplineSettingsSybDomainItemByIdResp,
      prevPvaReportsErrorAct,
    } = attributeSportsRef.current;

    if (
      saveDisciplineSettingsSubDomainItemByIdResp &&
      saveDisciplineSettingsSubDomainItemByIdResp !== prevSaveDisciplineSettingsSubDomainItemByIdResp
    ) {
      toast.success("Sub Domain added successfully");
      fetchSubDisciplineDomainsList();
      addEditSubDomainCloseModal();
      filterFormik.setValues((prev:any) => ({...prev,curriculumId:"",classId:""}))
    } else if (
      updateDisciplineSettingsSubDomainItemByIdResp &&
      updateDisciplineSettingsSubDomainItemByIdResp !== prevUpdateDisciplineSettingsSubDomainItemByIdResp
    ) {
      toast.success("Sub Domain updated successfully");
      fetchSubDisciplineDomainsList();
      addEditSubDomainCloseModal();
      filterFormik.setValues((prev:any) => ({...prev,curriculumId:"",classId:""}))
    } else if (
      delDisciplineSettingsSybDomainItemByIdResp &&
      delDisciplineSettingsSybDomainItemByIdResp !== prevDelDisciplineSettingsSybDomainItemByIdResp
    ) {
      delSubDomainCloseModal();
      toast.success("Sub Domain deleted successfully");
      fetchSubDisciplineDomainsList();
      filterFormik.setValues((prev:any) => ({...prev,curriculumId:"",classId:""}))
    } else if (
      pvaReportsErrorAct &&
      pvaReportsErrorAct !== prevPvaReportsErrorAct
    ) {
      const { details } = pvaReportsErrorAct;
      toast.error(details || "Something went wrong");
    }

    attributeSportsRef.current.prevSaveDisciplineSettingsSubDomainItemByIdResp =
      saveDisciplineSettingsSubDomainItemByIdResp;
    attributeSportsRef.current.prevUpdateDisciplineSettingsSubDomainItemByIdResp =
      updateDisciplineSettingsSubDomainItemByIdResp;
    attributeSportsRef.current.prevDelDisciplineSettingsSybDomainItemByIdResp =
      delDisciplineSettingsSybDomainItemByIdResp;
    attributeSportsRef.current.prevPvaReportsErrorAct =
      pvaReportsErrorAct;
  }, [
    saveDisciplineSettingsSubDomainItemByIdResp,
    updateDisciplineSettingsSubDomainItemByIdResp,
    delDisciplineSettingsSybDomainItemByIdResp,
    pvaReportsErrorAct,
  ]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    filterFormik.setFieldValue("academicYearId", yearId);
    fetchSubDisciplineDomainsList({ academicYearId: yearId });
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const {
    content: domainsList,
    totalElements,
    totalPages,
    pageable,
  } = getDisciplineSettingsSubDomainsResp || {};

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
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={filterFormik.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={filterFormik.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => addEditSubDomainOpenModal()}
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
        id="addEditSubDomainModal"
        isOpen={addEditSubDomainModalState.showModal}
        toggle={addEditSubDomainCloseModal}
        modalTitle={
          addEditSubDomainModalState.modalData
            ? "Edit Sub Domains"
            : "Add Sub Domains"
        }
        modalSize="lg"
      >
        <AddEditSubDomainModal
          editItemId={addEditSubDomainModalState.modalData}
          toggle={addEditSubDomainCloseModal}
          isOpen={addEditSubDomainModalState.showModal}
        ></AddEditSubDomainModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSubDomainModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sports Attribute?"
        cancelHndlr={delSubDomainCloseModal}
        confirmHndlr={delSubDisciplineDomainItem}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default DisciplineReportSubDomains;
