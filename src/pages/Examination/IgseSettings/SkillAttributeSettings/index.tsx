import React, { useCallback, useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02StrokeStandard,
  Drag03Icon,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useLocation } from "react-router-dom";
import {
  deleteSkillAttributeSettingsItemAct,
  getSkillAttributeSettingsItemByIdAct,
  getSkillAttributeSettingsListAct,
} from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateColumns } from "./helper";
import { useModal } from "../../../../hooks/modalhook";
import AddEditNewSkillAttributeModal from "./AddEditNewSkillAttributeModal";
import { toast } from "react-toastify";
import { de } from "date-fns/locale";
import SetSkillOrderModal from "./SetSkillOrderModal";
import SetAttributeOrderModal from "./SetAttributeOrderModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const SkillAttributeSettings = () => {
  const location = useLocation();
  const skillAttributeSettingsFormik = useFormik({
    initialValues,
    onSubmit: (value) => {},
  });
  const {
    openModal: addEditSkillAttributeOpenModal,
    closeModal: addEditSkillAttributeCloseModal,
    modalState: addEditSkillAttributeModalState,
  } = useModal();

  const {
    openModal: deleteSkillAttributeOpenModal,
    closeModal: deleteSkillAttributeCloseModal,
    modalState: deleteSkillAttributeModalState,
  } = useModal();

  const {
    closeModal: skillOrderCloseModal,
    modalState: skillOrderModalState,
    openModal: skillOrderOpenModal,
  } = useModal();
  const {
    closeModal: attributeOrderCloseModal,
    modalState: attributeOrderModalState,
    openModal: attributeOrderOpenModal,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    getSkillAttributeSettingsListResp,
    saveSkillAttributeSettingsItemResp,
    updateSkillAttributeSettingsItemResp,
    deleteSkillAttributeSettingsItemResp,
    saveSetSkillOrderResp,
    saveSetSkillAttributeOrderResp,
    cbseExaminationErrorAct,
  } = useAppSelector(
    ({
      instAcademics,
      appData,
      branchAcademics,
      examinationSettings,
      globalData,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,

      getSkillAttributeSettingsListResp:
        examinationSettings.getSkillAttributeSettingsListResp,
      saveSkillAttributeSettingsItemResp:
        examinationSettings.saveSkillAttributeSettingsItemResp,
      updateSkillAttributeSettingsItemResp:
        examinationSettings.updateSkillAttributeSettingsItemResp,
      deleteSkillAttributeSettingsItemResp:
        examinationSettings.deleteSkillAttributeSettingsItemResp,
      saveSetSkillOrderResp: examinationSettings.saveSetSkillOrderResp,
      saveSetSkillAttributeOrderResp:
        examinationSettings.saveSetSkillAttributeOrderResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  function delSkillAttributeItemHndlr() {
    dispatch(
      deleteSkillAttributeSettingsItemAct(
        generateActionPayload("delete_skill_entry_attribute", {
          id: deleteSkillAttributeModalState.modalData,
        })
      )
    );
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "setAttributeOrder",
        actionIcon: (
          <HugeiconsIcon icon={Drag03Icon} className="text-muted" size={18} />
        ),
        actionName: "Set Attribute Order",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          attributeOrderOpenModal(id);
        },
      },
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
          dispatch(
            getSkillAttributeSettingsItemByIdAct(
              generateActionPayload("get_skill_entry_attribute_list_by_id", {
                id,
              })
            )
          );
          addEditSkillAttributeOpenModal(id);
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
          deleteSkillAttributeOpenModal(id);
        },
      },
    ],
    []
  );

  const dropdownOptions = useMemo(
    () => [
      {
        id: "set-skills-order",
        actionName: "Set Skills Order",
        actionIcon: (
          <HugeiconsIcon
            icon={Add01Icon}
            className="me-2 text-muted"
            size={16}
          />
        ),
        onClickHndlr: () => {
          // addSpecialFeeModalHndlr();
          skillOrderOpenModal();
        },
      },
      {
        id: "set-attributes-order",
        actionName: "Set Attributes Order",
        actionIcon: (
          <HugeiconsIcon
            icon={Add01Icon}
            className="me-2 text-muted"
            size={16}
          />
        ),
        onClickHndlr: () => {
          // addSpecialFeeModalHndlr();
          attributeOrderOpenModal();
        },
      },
    ],
    []
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
  }

  function fetchBranchCurriculumsList(otherProps?: any) {
    const { academicYearId } = skillAttributeSettingsFormik.values;
    const payload = {
      branchId,
      academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      sortOrder: "asc",
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchSkillAttributeSettingsList(otherProps?: any) {
    const { academicYearId, curriculumId } =
      skillAttributeSettingsFormik.values;
    const payload = {
      branchId,
      academicYearId,
      branchCurriculumId: curriculumId,
      ...otherProps,
      ...paginationRef.current,
    };

    dispatch(
      getSkillAttributeSettingsListAct(
        generateActionPayload(
          "get_skill_attribute_settings_list",
          undefined,
          payload
        )
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      skillAttributeSettingsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        classId: "",
      }));
      if (value) {
        fetchBranchCurriculumsList({ academicYearId: value });
        fetchSkillAttributeSettingsList({ branchCurriculumId: value });
      }
    } else if (name === "curriculumId") {
      skillAttributeSettingsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
      }));
      if (value) {
        fetchSkillAttributeSettingsList({ branchCurriculumId: value });
      }
    } else {
      skillAttributeSettingsFormik.setFieldValue(name, value);
      fetchSkillAttributeSettingsList({ [name]: value });
    }
  }

  const skillAttributeSettingsFormikRef = useRef({
    prevSaveSkillAttributeSettingsItemResp: saveSkillAttributeSettingsItemResp,
    prevUpdateSkillAttributeSettingsItemResp:
      updateSkillAttributeSettingsItemResp,
    prevDeleteSkillAttributeSettingsItemResp:
      deleteSkillAttributeSettingsItemResp,
    prevSaveSetSkillOrderResp: saveSetSkillOrderResp,
    prevSaveSetSkillAttributeOrderResp: saveSetSkillAttributeOrderResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveSkillAttributeSettingsItemResp,
      prevUpdateSkillAttributeSettingsItemResp,
      prevDeleteSkillAttributeSettingsItemResp,
      prevSaveSetSkillOrderResp,
      prevSaveSetSkillAttributeOrderResp,
      prevCbseExaminationErrorAct,
    } = skillAttributeSettingsFormikRef.current;

    if (
      saveSkillAttributeSettingsItemResp &&
      prevSaveSkillAttributeSettingsItemResp !==
        saveSkillAttributeSettingsItemResp
    ) {
      toast.success("Skill Attribute added successfully");
      addEditSkillAttributeCloseModal();
      fetchSkillAttributeSettingsList();
    } else if (
      updateSkillAttributeSettingsItemResp &&
      prevUpdateSkillAttributeSettingsItemResp !==
        updateSkillAttributeSettingsItemResp
    ) {
      toast.success("Skill Attribute updated successfully");
      addEditSkillAttributeCloseModal();
      fetchSkillAttributeSettingsList();
    } else if (
      deleteSkillAttributeSettingsItemResp &&
      prevDeleteSkillAttributeSettingsItemResp !==
        deleteSkillAttributeSettingsItemResp
    ) {
      toast.success("Skill Attribute deleted successfully");
      fetchSkillAttributeSettingsList();
      deleteSkillAttributeCloseModal();
    } else if (
      saveSetSkillOrderResp &&
      saveSetSkillOrderResp !== prevSaveSetSkillOrderResp
    ) {
      toast.success("Skills order updated successfully");
      fetchSkillAttributeSettingsList();
      skillOrderCloseModal();
    } else if (
      saveSetSkillAttributeOrderResp &&
      saveSetSkillAttributeOrderResp !== prevSaveSetSkillAttributeOrderResp
    ) {
      toast.success("Skills Attribute order updated successfully");
      fetchSkillAttributeSettingsList();
      attributeOrderCloseModal();
    } else if (
      cbseExaminationErrorAct &&
      prevCbseExaminationErrorAct !== cbseExaminationErrorAct
    ) {
      const { details, error } = cbseExaminationErrorAct || {};
      toast.error(details || error || "Something went wrong.");
    }

    skillAttributeSettingsFormikRef.current.prevSaveSkillAttributeSettingsItemResp =
      saveSkillAttributeSettingsItemResp;
    skillAttributeSettingsFormikRef.current.prevUpdateSkillAttributeSettingsItemResp =
      updateSkillAttributeSettingsItemResp;
    skillAttributeSettingsFormikRef.current.prevDeleteSkillAttributeSettingsItemResp =
      deleteSkillAttributeSettingsItemResp;
    skillAttributeSettingsFormikRef.current.prevSaveSetSkillOrderResp =
      saveSetSkillOrderResp;
    skillAttributeSettingsFormikRef.current.prevSaveSetSkillAttributeOrderResp =
      saveSetSkillAttributeOrderResp;
    skillAttributeSettingsFormikRef.current.prevCbseExaminationErrorAct =
      cbseExaminationErrorAct;
  }, [
    saveSkillAttributeSettingsItemResp,
    updateSkillAttributeSettingsItemResp,
    deleteSkillAttributeSettingsItemResp,
    saveSetSkillOrderResp,
    saveSetSkillAttributeOrderResp,
    cbseExaminationErrorAct,
  ]);

  useEffect(() => {
    let yearId = academicYearListResp?.data?.find(
      (year: any) => year.yearStatus.toLowerCase() === "current"
    )?.academicYearId;

    if (yearId) {
      skillAttributeSettingsFormik.setFieldValue("academicYearId", yearId);
      fetchBranchCurriculumsList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/igcse-settings/skill-attribute-settings": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      skillAttributeSettingsFormik.values.academicYearId
    ) {
      const selectedCurriculum = data.find(
        (curriculum: any) => curriculum.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        skillAttributeSettingsFormik.setValues((prev: any) => ({
          ...prev,
          curriculumId: "",
          classId: "",
        }));
      }
      fetchSkillAttributeSettingsList({
        branchCurriculumId: selectedCurriculum?.branchCurriculumId,
      });
      skillAttributeSettingsFormik.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum?.branchCurriculumId || "",
        classId: "",
      }));
    }
  }, [brchCurriculumResp, skillAttributeSettingsFormik.values.academicYearId]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: branchCurriculumList } = brchCurriculumResp || {};
  const { content: branchClassList } = branchClassResp || {};
  const {
    content: skillAttributeSettingsList,
    totalPages,
    totalElements,
    pageable,
  } = getSkillAttributeSettingsListResp || {};
  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const setOrderOpenHndler = () => {
    if (!skillAttributeSettingsFormik.values.academicYearId) {
      toast.error("Please select Academic Year");
      return;
    } else if (!skillAttributeSettingsFormik.values.curriculumId) {
      toast.error("Please select Curriculum");
      return;
    }
    skillOrderOpenModal();
  };

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Skill Attribute Settings
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3 align-items-center tw-mb-4">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      placeHolder="Search..."
                      value={skillAttributeSettingsFormik.values.searchString}
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
                    value={skillAttributeSettingsFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  ></SelectInput>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={skillAttributeSettingsFormik.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={branchCurriculumList || []}
                    valueKey="branchCurriculumId"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    labelText="Curriculum"
                    floatingLabel
                    isDisabled={true}
                  ></SelectInput>
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={skillAttributeSettingsFormik.values.classId}
                    onChange={filterHandler}
                    menuItems={branchClassList || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    floatingLabel
                    labelText="Class"
                  ></SelectInput>
                </div> */}
                <div className="col-auto ms-auto d-flex align-items-center">
                  <button
                    className="btn btn-primary me-2"
                    onClick={setOrderOpenHndler}
                  >
                    Set Order
                  </button>
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => addEditSkillAttributeOpenModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(skillAttributeSettingsList) &&
                  skillAttributeSettingsList
                    ? skillAttributeSettingsList
                    : []
                }
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
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
        id="addEditSkillAttributeModal"
        isOpen={addEditSkillAttributeModalState.showModal}
        toggle={addEditSkillAttributeCloseModal}
        modalTitle={
          addEditSkillAttributeModalState.modalData
            ? "Edit Skill Attribute"
            : "Add Skill Attribute"
        }
        modalSize="lg"
      >
        <AddEditNewSkillAttributeModal
          toggle={addEditSkillAttributeCloseModal}
          editItemId={addEditSkillAttributeModalState.modalData}
        ></AddEditNewSkillAttributeModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="skillOrderModal"
        isOpen={skillOrderModalState.showModal}
        toggle={skillOrderCloseModal}
        modalTitle="Set Skills Order"
        modalSize="md"
      >
        <SetSkillOrderModal
          modalData={skillAttributeSettingsList}
          isOpen={skillOrderModalState.showModal}
          toggle={() => skillOrderCloseModal()}
          formValues={skillAttributeSettingsFormik.values}
          showApiLoader={showApiLoader}
        ></SetSkillOrderModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="skillAttributeOrderModal"
        isOpen={attributeOrderModalState.showModal}
        toggle={attributeOrderCloseModal}
        modalTitle="Set Attribute Order"
        modalSize="md"
      >
        <SetAttributeOrderModal
          modalData={
            skillAttributeSettingsList?.find(
              (item: any) => +item.id === +attributeOrderModalState?.modalData
            )?.attributes || []
          }
          selectedItemId={attributeOrderModalState?.modalData}
          isOpen={attributeOrderModalState.showModal}
          toggle={() => attributeOrderCloseModal()}
          formValues={skillAttributeSettingsFormik.values}
          showApiLoader={showApiLoader}
        ></SetAttributeOrderModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-skill-attribute-modal"
        isOpen={deleteSkillAttributeModalState.showModal}
        confirmMessage="Are you sure you want to delete this Skill Attribute?"
        cancelHndlr={deleteSkillAttributeCloseModal}
        confirmHndlr={delSkillAttributeItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SkillAttributeSettings;
