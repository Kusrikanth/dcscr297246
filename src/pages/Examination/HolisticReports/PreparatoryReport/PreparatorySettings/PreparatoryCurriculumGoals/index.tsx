import React, { useEffect, useMemo, useRef, useState } from "react";

import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  getPreparatoryCurriculumGoalsAct,
  getPreparatoryDomainAct,
} from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storehook";
import { useModal } from "../../../../../../hooks/modalhook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import BreadCrumb from "../../../../../../Components/Common/BreadCrumb";
import {
  ConfirmationModal,
  CustomSelect,
  ModalContainerUpdated,
} from "../../../../../../Components/Common";
import { ModuleTree } from "../../../Settings/CurriculumGoals/TreeComponent";
import "../../../Settings/CurriculumGoals/_treecomponent.scss";
import {
  renderOptionsEmployee,
  renderValueSection,
  transformGoalsToFeatures,
  TreeContextProvider,
} from "../../../Settings/CurriculumGoals/helper";
import AddEditNewCurriculumGoal from "./AddEditNewCurriculumGoal";

const initialValues = {
  searchString: "",
  domain: "",
};

const PreparatoryCurriculumGoals = () => {
  const [expandCollapseState, setExpandCollapseState] = useState<any>({
    action: "",
    ids: [],
  });
  const {
    closeModal: closeDeleteRoleTypeModal,
    modalState: deleteRoleTypeModalState,
    openModal: openDeleteRoleTypeModal,
  } = useModal();
  const {
    openModal: addEditSportNameOpenModal,
    closeModal: addEditSportNameCloseModal,
    modalState: addEditSportNameModalState,
  } = useModal();

  const dispatch = useAppDispatch();

  const {
    updatePreparatoryCurriculumGoalsResp,
    cbseExaminationErrorAct,
    savePreparatoryCurriculumGoalsResp,
    getPreparatoryCurriculumGoalsResp,
    getPreparatoryDomainResp,
    loggedInUserRole,
    virtualRoleResp,
  } = useAppSelector(
    ({ appData, examinationSettings }) => ({
      updatePreparatoryCurriculumGoalsResp:
        examinationSettings.updatePreparatoryCurriculumGoalsResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      savePreparatoryCurriculumGoalsResp:
        examinationSettings.savePreparatoryCurriculumGoalsResp,
      getPreparatoryCurriculumGoalsResp:
        examinationSettings.getPreparatoryCurriculumGoalsResp,
      getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
    }),
    shallowEqual
  );

  const showInstituteAdminUI =
    loggedInUserRole === "INSTITUTE_ADMIN" && !virtualRoleResp;

  const sportsNameFormik = useFormik({
    initialValues,
    onSubmit: (value) => {},
  });

  const getHolisticDomainApiCall = (otherProps?: any) => {
    dispatch(
      getPreparatoryDomainAct(
        generateActionPayload("get_preparatory_domain", undefined, {})
      )
    );
  };

  const getCurriculumGoalApiCall = (otherProps?: any) => {
    const payload = {
      fsDomainId: sportsNameFormik.values?.domain,
      ...otherProps,
    };
    dispatch(
      getPreparatoryCurriculumGoalsAct(
        generateActionPayload(
          "get_preparatory_curriculum_goals",
          undefined,
          payload
        )
      )
    );
  };

  const sportsNamesRef = useRef({
    prevSavePreparatoryCurriculumGoalsResp: savePreparatoryCurriculumGoalsResp,
    prevUpdatePreparatoryCurriculumGoalsResp: updatePreparatoryCurriculumGoalsResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const {
      prevSavePreparatoryCurriculumGoalsResp,
      prevUpdatePreparatoryCurriculumGoalsResp,
      prevCbseExaminationErrorAct,
    } = sportsNamesRef.current;

    if (
      savePreparatoryCurriculumGoalsResp &&
      savePreparatoryCurriculumGoalsResp !== prevSavePreparatoryCurriculumGoalsResp
    ) {
      toast.success("Curricular Goals added successfully");
      addEditSportNameCloseModal();
      getCurriculumGoalApiCall();
    } else if (
      updatePreparatoryCurriculumGoalsResp &&
      updatePreparatoryCurriculumGoalsResp !==
        prevUpdatePreparatoryCurriculumGoalsResp
    ) {
      toast.success("Curricular Goals updated successfully");
      addEditSportNameCloseModal();
      getCurriculumGoalApiCall();
    } else if (
      cbseExaminationErrorAct &&
      cbseExaminationErrorAct !== prevCbseExaminationErrorAct
    ) {
      const { details } = cbseExaminationErrorAct;
      toast.error(details || "Something went wrong");
    }

    sportsNamesRef.current.prevSavePreparatoryCurriculumGoalsResp =
      savePreparatoryCurriculumGoalsResp;
    sportsNamesRef.current.prevUpdatePreparatoryCurriculumGoalsResp =
      updatePreparatoryCurriculumGoalsResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct =
      cbseExaminationErrorAct;
  }, [
    savePreparatoryCurriculumGoalsResp,
    updatePreparatoryCurriculumGoalsResp,
    cbseExaminationErrorAct,
  ]);

  function expandCollapseHndlr(
    action: "COLLAPSE" | "EXPAND_ALL" | "COLLAPSE_ALL",
    ids: string[]
  ) {
    setExpandCollapseState((prevState) => ({ ...prevState, action, ids }));
  }

  function editModuleHandler({ featureId }: { featureId: string }) {
    addEditSportNameOpenModal(featureId);
  }

  function addModuleHandler() {
    addEditSportNameOpenModal();
  }

  function deleteModuleHndlr({ featureId }: { featureId: string }) {
    openDeleteRoleTypeModal(featureId);
  }

  const featuresData1 = useMemo(
    () => transformGoalsToFeatures(getPreparatoryCurriculumGoalsResp),
    [getPreparatoryCurriculumGoalsResp]
  );

  function delModalSubmitHndlr() {
    const { modalData } = deleteRoleTypeModalState;
    closeDeleteRoleTypeModal();
  }

  function selectSectionHndlr(
    selectedOptions: number | number[],
    config?: any
  ) {
    const { name } = config;
    const selectedContactPerson = getPreparatoryDomainResp.find(
      (item: { id: number }) => +item.id === +selectedOptions
    );
    if (selectedContactPerson) {
      sportsNameFormik.setValues((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
      getCurriculumGoalApiCall({ fsDomainId: selectedContactPerson.id });
    } else {
      sportsNameFormik.setValues((prevState) => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    }
  }

  useEffect(() => {
    getCurriculumGoalApiCall();
    getHolisticDomainApiCall();
  }, []);

  useEffect(() => {
    if (
      Array.isArray(getPreparatoryDomainResp) &&
      getPreparatoryDomainResp.length > 0
    ) {
      const defaultDomain = getPreparatoryDomainResp[0];
      sportsNameFormik.setFieldValue("domain", defaultDomain.id);
      getCurriculumGoalApiCall({ fsDomainId: defaultDomain.id });
    }
  }, [getPreparatoryDomainResp]);

  return (
    <>
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <BreadCrumb title="Examination" pageTitle="Examination" />
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Curricular Goals
                    </h4>
                  </div>
                  {showInstituteAdminUI && (
                    <div className="col-auto ms-auto">
                      <button
                        className="btn btn-success float-end d-flex align-items-center"
                        onClick={() => addEditSportNameOpenModal()}
                      >
                        <i className="ri-add-line me-2" />
                        Add New
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body p-0">
                <div className="tw-p-4 !tw-py-1">
                  <div className="row">
                    <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                      <CustomSelect
                        name="domain"
                        idKey="id"
                        defaultSelect="Select"
                        value={sportsNameFormik.values.domain}
                        renderValue={renderValueSection}
                        renderOptions={renderOptionsEmployee}
                        onChange={selectSectionHndlr}
                        labelText="Domain"
                        containerClassName="mb-3"
                        options={getPreparatoryDomainResp || []}
                      />
                    </div>
                  </div>
                </div>

                <div className="modules-container feature-grid">
                  <div className="custom-row header">
                    <div className="custom-column">Goal Name</div>
                  </div>
                  <TreeContextProvider.Provider
                    value={{
                      value: expandCollapseState,
                      toggle: expandCollapseHndlr,
                      editModuleHandler,
                      addModuleHandler,
                      deleteModuleHndlr,
                    }}
                  >
                    {featuresData1?.map((item) => (
                      <ModuleTree
                        key={item.id}
                        level={1}
                        parentsInfo={[]}
                        parentFeatureId={""}
                        {...item}
                        showInstituteAdminUI={showInstituteAdminUI}
                      />
                    ))}
                  </TreeContextProvider.Provider>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          id="delete-permission-modal"
          isOpen={deleteRoleTypeModalState.showModal}
          confirmMessage="Are you sure you want to delete this goal?"
          cancelHndlr={closeDeleteRoleTypeModal}
          confirmHndlr={delModalSubmitHndlr}
          iconType="reject"
          showImgIcon={true}
        />

        <ModalContainerUpdated
          id="add-edit-sports-names-modal"
          isOpen={addEditSportNameModalState.showModal}
          toggle={addEditSportNameCloseModal}
          modalTitle={
            addEditSportNameModalState.modalData
              ? "Edit Curricular Goal"
              : "Add Curricular Goal"
          }
          modalSize="md"
        >
          <AddEditNewCurriculumGoal
            toggle={addEditSportNameCloseModal}
            id={addEditSportNameModalState.modalData}
            dataLength={featuresData1?.length || 0}
          />
        </ModalContainerUpdated>
      </React.Fragment>
    </>
  );
};

export default PreparatoryCurriculumGoals;
