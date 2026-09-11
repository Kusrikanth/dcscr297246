import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAcademicDetailsListAct, getDigitalCurriculumValidationListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import AddDigitalCurriculumValidationModal from "./AddDigitalCurriculumValidationModal";

const initialValues = {
  courseAcademicYearId: ""
}

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
});

const DigitalCurriculumValidation = () => {
  const { openModal: openDigitalCurriculumValidationModal, closeModal: closeDigitalCurriculumValidationModal, modalState: digitalCurriculumValidationModalState } = useModal();
  const { openModal: openDelDigitalCurriculumValidationModal, closeModal: closeDelDigitalCurriculumValidationModal, modalState: delDigitalCurriculumValidationModalState, } = useModal();
  const dispatch = useAppDispatch();

  const getDigitalCurriculumValidationApiCall = (otherProps?: any) => {
    let payload = {
      academicYearId: addDigitalCurriculumValidationFormik.values.courseAcademicYearId
    };
    dispatch(getDigitalCurriculumValidationListAct(generateActionPayload("get_digital_curriculum_validation_list", undefined, payload)));
  };

  const getAcademicYearDetailsApiCall = (otherProps?: any) => {
    let payload = {
    };
    dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
  };

  const addDigitalCurriculumValidationFormik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
    },
  });

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getDigitalCurriculumValidationListResp,
    saveDigitalCurriculumValidationResp,
    getAcademicDetailsListResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({ appData, lmsSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getDigitalCurriculumValidationListResp: lmsSettings.getDigitalCurriculumValidationListResp,
      saveDigitalCurriculumValidationResp: lmsSettings.saveDigitalCurriculumValidationResp,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const digitalCurriculumValidationRef = useRef({
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevSaveDigitalCurriculumValidationResp: saveDigitalCurriculumValidationResp,
  })

  useEffect(() => {
    const { prevLmsSettingsErrorAct, prevSaveDigitalCurriculumValidationResp } = digitalCurriculumValidationRef.current || {}
    if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details } = lmsSettingsErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveDigitalCurriculumValidationResp && prevSaveDigitalCurriculumValidationResp !== saveDigitalCurriculumValidationResp) {
      if (digitalCurriculumValidationModalState.modalData) {
        toast.success("Validation Details Updated Successfully");
      } else {
        toast.success("Validation Details Added Successfully");
      }
      closeDigitalCurriculumValidationModal();
      getDigitalCurriculumValidationApiCall();
    }
    digitalCurriculumValidationRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    digitalCurriculumValidationRef.current.prevSaveDigitalCurriculumValidationResp = saveDigitalCurriculumValidationResp;
  }, [lmsSettingsErrorAct, saveDigitalCurriculumValidationResp])

  useEffect(() => {
    if (addDigitalCurriculumValidationFormik.values.courseAcademicYearId) {
      getDigitalCurriculumValidationApiCall();
    }
  }, [addDigitalCurriculumValidationFormik.values.courseAcademicYearId]);

  useEffect(() => {
    getAcademicYearDetailsApiCall();
  }, []);

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { academicYearId } = getAcademicDetailsListResp[0];
      if (academicYearId) {
        addDigitalCurriculumValidationFormik.setFieldValue(
          "courseAcademicYearId",
          academicYearId
        );
      }
    }
  }, [getAcademicDetailsListResp]);

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
          const rowId = Number(event.currentTarget.getAttribute("data-id"));
          const rowData = getDigitalCurriculumValidationListResp?.find(
            (item: any) => item.id === rowId
          );
          if (!rowData) return;
          openDigitalCurriculumValidationModal(rowData);
        }
      },
    ],
    [getDigitalCurriculumValidationListResp]
  );
  const tableColumns = useMemo(() => generateColumns(menuOptions), [getDigitalCurriculumValidationListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Curriculum Validation
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => openDigitalCurriculumValidationModal()}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="me-2"
                    size={18}
                  />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="py-3 px-3">
            <div className="row g-3">
              <div className="col-12">
                <div className="row g-3">
                  <div className="col-xs-12 col-md-4">
                    <SelectInput
                      name="courseAcademicYearId"
                      labelText="Academic Year"
                      labelClass="required"
                      value={addDigitalCurriculumValidationFormik.values.courseAcademicYearId}
                      onChange={addDigitalCurriculumValidationFormik.handleChange}
                      onBlur={addDigitalCurriculumValidationFormik.handleBlur}
                      menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                      valueKey="academicYearId"
                      textKey="courseAcademicYearName"
                      formgroupClassName="mb-0"
                      floatingLabel
                      isDisabled
                      invalid={(addDigitalCurriculumValidationFormik.touched.courseAcademicYearId && addDigitalCurriculumValidationFormik.errors.courseAcademicYearId) ? true : false}
                      error={(addDigitalCurriculumValidationFormik.touched.courseAcademicYearId && addDigitalCurriculumValidationFormik.errors.courseAcademicYearId) ? addDigitalCurriculumValidationFormik.errors.courseAcademicYearId : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(getDigitalCurriculumValidationListResp) ? getDigitalCurriculumValidationListResp : []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={digitalCurriculumValidationModalState.showModal}
        toggle={closeDigitalCurriculumValidationModal}
        modalTitle={
          digitalCurriculumValidationModalState.modalData
            ? "Edit Curriculum Validation's"
            : "Add Curriculum Validation's"
        }
        modalSize="lg"
      >
        <AddDigitalCurriculumValidationModal
          toggle={closeDigitalCurriculumValidationModal}
          id={digitalCurriculumValidationModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default DigitalCurriculumValidation;
