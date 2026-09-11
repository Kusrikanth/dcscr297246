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
import AddSchoolPeriodsModal from "./AddSchoolPeriodsModal";
import { deleteSchoolPeriodDetailsAct, getAcademicDetailsListAct, getSchoolPeriodDetailsByIdAct, getSchoolPeriodDetailsListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";

const initialValues = {
  courseAcademicYearId: ""
}

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
});

const SchoolPeriods = () => {
  const { openModal: openSchoolPeriodsModal, closeModal: closeSchoolPeriodsModal, modalState: academicTermDetailsModalState } = useModal();
  const { openModal: openDelSchoolPeriodsModal, closeModal: closeDelSchoolPeriodsModal, modalState: delSchoolPeriodsModalState, } = useModal();
  const dispatch = useAppDispatch();

  const getSchoolPeriodsApiCall = (otherProps?: any) => {
    let payload = {
      courseAcademicYearId: addSchoolPeriodsFormik.values.courseAcademicYearId
    };
    dispatch(getSchoolPeriodDetailsListAct(generateActionPayload("get_school_period_details_list", undefined, payload)));
  };

  const getAcademicYearDetailsApiCall = (otherProps?: any) => {
    let payload = {
    };
    dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
  };

  const addSchoolPeriodsFormik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
    },
  });

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getSchoolPeriodDetailsListResp,
    saveSchoolPeriodDetailsResp,
    deleteSchoolPeriodDetailsResp,
    getAcademicDetailsListResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({ appData, lmsSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getSchoolPeriodDetailsListResp: lmsSettings.getSchoolPeriodDetailsListResp,
      saveSchoolPeriodDetailsResp: lmsSettings.saveSchoolPeriodDetailsResp,
      deleteSchoolPeriodDetailsResp: lmsSettings.deleteSchoolPeriodDetailsResp,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const academicTermDetailsRef = useRef({
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevSaveSchoolPeriodsResp: saveSchoolPeriodDetailsResp,
    prevDeleteSchoolPeriodsResp: deleteSchoolPeriodDetailsResp,
  })

  useEffect(() => {
    const { prevLmsSettingsErrorAct, prevSaveSchoolPeriodsResp, prevDeleteSchoolPeriodsResp } = academicTermDetailsRef.current || {}
    if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details } = lmsSettingsErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveSchoolPeriodDetailsResp && prevSaveSchoolPeriodsResp !== saveSchoolPeriodDetailsResp) {
      toast.success("School Period's Details Added successfully")
      getSchoolPeriodsApiCall();
      closeSchoolPeriodsModal();
    }
    else if (deleteSchoolPeriodDetailsResp && prevDeleteSchoolPeriodsResp !== deleteSchoolPeriodDetailsResp) {
      toast.success("School Period's Details Deleted successfully")
      getSchoolPeriodsApiCall();
      closeDelSchoolPeriodsModal();
    }
    academicTermDetailsRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    academicTermDetailsRef.current.prevSaveSchoolPeriodsResp = saveSchoolPeriodDetailsResp;
    academicTermDetailsRef.current.prevDeleteSchoolPeriodsResp = deleteSchoolPeriodDetailsResp;
  }, [lmsSettingsErrorAct, saveSchoolPeriodDetailsResp, deleteSchoolPeriodDetailsResp])

  useEffect(() => {
    if (addSchoolPeriodsFormik.values.courseAcademicYearId) {
      getSchoolPeriodsApiCall();
    }
  }, [addSchoolPeriodsFormik.values.courseAcademicYearId]);

  useEffect(() => {
      getAcademicYearDetailsApiCall();
  }, []);

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        addSchoolPeriodsFormik.setFieldValue(
          "courseAcademicYearId",
          id
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
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getSchoolPeriodDetailsByIdAct(generateActionPayload("get_school_period_details_by_id", { id })));
          openSchoolPeriodsModal(id);
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
          openDelSchoolPeriodsModal(id);
        },
      },
    ],
    [getSchoolPeriodDetailsListResp]
  );

  function delModalSubmitHndlr() {
    dispatch(deleteSchoolPeriodDetailsAct(generateActionPayload("delete_school_period_details_by_id", { id: delSchoolPeriodsModalState.modalData })));
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getSchoolPeriodDetailsListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                School Period's
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => openSchoolPeriodsModal()}
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
                      value={addSchoolPeriodsFormik.values.courseAcademicYearId}
                      onChange={addSchoolPeriodsFormik.handleChange}
                      onBlur={addSchoolPeriodsFormik.handleBlur}
                      menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                      valueKey="id"
                      textKey="courseAcademicYearName"
                      isDisabled
                      formgroupClassName="mb-0"
                      floatingLabel
                      invalid={(addSchoolPeriodsFormik.touched.courseAcademicYearId && addSchoolPeriodsFormik.errors.courseAcademicYearId) ? true : false}
                      error={(addSchoolPeriodsFormik.touched.courseAcademicYearId && addSchoolPeriodsFormik.errors.courseAcademicYearId) ? addSchoolPeriodsFormik.errors.courseAcademicYearId : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(getSchoolPeriodDetailsListResp) ? getSchoolPeriodDetailsListResp : []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={academicTermDetailsModalState.showModal}
        toggle={closeSchoolPeriodsModal}
        modalTitle={
          academicTermDetailsModalState.modalData
            ? "Edit School Period's Details"
            : "Add School Period's Details"
        }
        modalSize="lg"
      >
        <AddSchoolPeriodsModal
          toggle={closeSchoolPeriodsModal}
          id={academicTermDetailsModalState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delSchoolPeriodsModalState.showModal}
        confirmMessage="Are you sure you want to Delete the School Period's Details"
        cancelHndlr={closeDelSchoolPeriodsModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default SchoolPeriods;
