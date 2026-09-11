import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  CustomSelect,
  ModalContainerUpdated,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewSportsModal from "./AddEditNewSportsModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { ModuleTree } from "./TreeComponent";
import "./_treecomponent.scss";
import { getHolisticCurriculumGoalsAct, getHolisticDomainAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { renderOptionsEmployee, renderValueSection, transformGoalsToFeatures, TreeContextProvider } from "./helper";


const initialValues = {
  searchString: "",
  domain: "",
};

const DomainActivities = () => {

  const [expandCollapseState, setExpandCollapseState] = useState<any>({
    action: '',
    ids: []
  })
  const { closeModal: closeDeleteRoleTypeModal, modalState: deleteRoleTypeModalState, openModal: openDeleteRoleTypeModal } = useModal();
  const {
    openModal: addEditSportNameOpenModal,
    closeModal: addEditSportNameCloseModal,
    modalState: addEditSportNameModalState,
  } = useModal();

  const dispatch = useAppDispatch();

  const {
    updateHolisticCurriculumGoalsResp,
    cbseExaminationErrorAct,
    saveHolisticCurriculumGoalsResp,
    getHolisticCurriculumGoalsResp,
    getHolisticDomainResp,
    loggedInUserRole,
    virtualRoleResp
  } = useAppSelector(
    ({ appData, examinationSettings }) => ({
      updateHolisticCurriculumGoalsResp: examinationSettings.updateHolisticCurriculumGoalsResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      saveHolisticCurriculumGoalsResp: examinationSettings.saveHolisticCurriculumGoalsResp,
      getHolisticCurriculumGoalsResp: examinationSettings.getHolisticCurriculumGoalsResp,
      getHolisticDomainResp: examinationSettings.getHolisticDomainResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp
    }),
    shallowEqual
  );

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const sportsNameFormik = useFormik({
    initialValues,
    onSubmit: (value) => { },
  });

  const getHolisticDomainApiCall = (otherProps?: any) => {
    dispatch(getHolisticDomainAct(generateActionPayload("get_holistic_domain", undefined, {})));
  };

  const getCurriculumGoalApiCall = (otherProps?: any) => {
    const payload = {
      fsDomainId: sportsNameFormik.values?.domain,
      ...otherProps
    };
    dispatch(getHolisticCurriculumGoalsAct(generateActionPayload("get_holistic_curriculum_goals", undefined, payload)));
  };

  const sportsNamesRef = useRef({
    prevSaveHolisticCurriculumGoalsResp: saveHolisticCurriculumGoalsResp,
    prevUpdateHolisticCurriculumGoalsResp: updateHolisticCurriculumGoalsResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveHolisticCurriculumGoalsResp,
      prevUpdateHolisticCurriculumGoalsResp,
      prevCbseExaminationErrorAct,
    } = sportsNamesRef.current;

    if (
      saveHolisticCurriculumGoalsResp &&
      saveHolisticCurriculumGoalsResp !== prevSaveHolisticCurriculumGoalsResp
    ) {
      toast.success("Curricular Goals added successfully");
      addEditSportNameCloseModal();
      getCurriculumGoalApiCall();
    } else if (
      updateHolisticCurriculumGoalsResp &&
      updateHolisticCurriculumGoalsResp !== prevUpdateHolisticCurriculumGoalsResp
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

    sportsNamesRef.current.prevSaveHolisticCurriculumGoalsResp = saveHolisticCurriculumGoalsResp;
    sportsNamesRef.current.prevUpdateHolisticCurriculumGoalsResp = updateHolisticCurriculumGoalsResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [
    saveHolisticCurriculumGoalsResp,
    updateHolisticCurriculumGoalsResp,
    cbseExaminationErrorAct,
  ]);


  function expandCollapseHndlr(action: 'COLLAPSE' | 'EXPAND_ALL' | 'COLLAPSE_ALL', ids: string[]) {
    setExpandCollapseState(prevState => ({ ...prevState, action, ids }))
  }

  function editModuleHandler({ featureId }: {
    featureId: string,
  }) {
    addEditSportNameOpenModal(featureId);
  }

  function addModuleHandler() {
    addEditSportNameOpenModal();
  }

  function deleteModuleHndlr({ featureId }: {
    featureId: string,
  }) {
    openDeleteRoleTypeModal(featureId);
  }

  const featuresData1 = useMemo(() => transformGoalsToFeatures(getHolisticCurriculumGoalsResp), [getHolisticCurriculumGoalsResp]);

  function delModalSubmitHndlr() {
    const { modalData } = deleteRoleTypeModalState;
    closeDeleteRoleTypeModal();
  }

  function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
    const { name } = config;
    const selectedContactPerson = getHolisticDomainResp.find((item: { id: number }) => +item.id === +selectedOptions);
    if (selectedContactPerson) {
      sportsNameFormik.setValues((prevState) => ({
        ...prevState, [name]: selectedOptions
      }))
      getCurriculumGoalApiCall({ fsDomainId: selectedContactPerson.id });
    }
    else {
      sportsNameFormik.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
    }
  }

  useEffect(() => {
    getCurriculumGoalApiCall();
    getHolisticDomainApiCall();
  }, []);

  useEffect(() => {
    if (Array.isArray(getHolisticDomainResp) && getHolisticDomainResp.length > 0) {
      const defaultDomain = getHolisticDomainResp[0];
      sportsNameFormik.setFieldValue('domain', defaultDomain.id);
      getCurriculumGoalApiCall({ fsDomainId: defaultDomain.id });
    }
  }, [getHolisticDomainResp])


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
                    <h4 className="card-title mb-0 flex-grow-1">Curricular Goals</h4>
                  </div>
                  {showInstituteAdminUI && <div className="col-auto ms-auto">
                    <button
                      className="btn btn-success float-end d-flex align-items-center"
                      onClick={() => addEditSportNameOpenModal()}
                    >
                      <i className="ri-add-line me-2" />
                      Add New
                    </button>
                  </div>}
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
                        labelText='Domain'
                        containerClassName="mb-3"
                        options={getHolisticDomainResp || []}
                      />
                    </div>
                  </div>
                </div>

                <div className="modules-container feature-grid">
                  <div className="custom-row header">
                    <div className="custom-column">Goal Name</div>
                  </div>
                  <TreeContextProvider.Provider value={{
                    value: expandCollapseState,
                    toggle: expandCollapseHndlr,
                    editModuleHandler,
                    addModuleHandler,
                    deleteModuleHndlr
                  }}>
                    {featuresData1?.map(item => (
                      <ModuleTree
                        key={item.id}
                        level={1}
                        parentsInfo={[]}
                        parentFeatureId={''}
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
          <AddEditNewSportsModal
            toggle={addEditSportNameCloseModal}
            id={addEditSportNameModalState.modalData}
            dataLength={featuresData1?.length || 0}
          />
        </ModalContainerUpdated>

      </React.Fragment>
    </>
  );
};

export default DomainActivities;