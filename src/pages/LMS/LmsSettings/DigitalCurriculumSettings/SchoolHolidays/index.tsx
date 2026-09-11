import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteSchoolHolidaysAct, getAcademicDetailsListAct, getSchoolHolidaysByIdAct, getSchoolHolidaysListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useFormik } from "formik";
import AddSchoolHolidaysModal from "./AddSchoolHolidaysModal";

const initialValues = {
  holidayName: "",
  academicYearId: ""
}

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
});

const SchoolHolidays = () => {
  const { openModal: openSchoolHolidaysModal, closeModal: closeSchoolHolidaysModal, modalState: schoolHolidaysModalState } = useModal();
  const { openModal: openDelSchoolHolidaysModal, closeModal: closeDelSchoolHolidaysYearModal, modalState: delSchoolHolidaysModalState, } = useModal();
  const dispatch = useAppDispatch();

  const getSchoolHolidaysApiCall = (otherProps?: any) => {
    let payload = {
      holidayName: schoolHolidaysFormik.values.holidayName,
      courseAcademicYearId: schoolHolidaysFormik.values.academicYearId
    };
    dispatch(getSchoolHolidaysListAct(generateActionPayload("get_school_holidays_list", undefined, payload)));
  };

  const getAcademicYearDetailsApiCall = (otherProps?: any) => {
    let payload = {
    };
    dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
  };

  const schoolHolidaysFormik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
    },
  });

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getSchoolHolidaysListResp,
    saveSchoolHolidaysResp,
    deleteSchoolHolidaysResp,
    getAcademicDetailsListResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({
      appData, lmsSettings,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getSchoolHolidaysListResp: lmsSettings.getSchoolHolidaysListResp,
      saveSchoolHolidaysResp: lmsSettings.saveSchoolHolidaysResp,
      deleteSchoolHolidaysResp: lmsSettings.deleteSchoolHolidaysResp,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const schoolHolidaysRef = useRef({
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    preSaveSchoolHolidaysRespResp: saveSchoolHolidaysResp,
    prevDeleteSchoolHolidaysResp: deleteSchoolHolidaysResp,
  })

  useEffect(() => {
    const { prevLmsSettingsErrorAct, preSaveSchoolHolidaysRespResp, prevDeleteSchoolHolidaysResp } = schoolHolidaysRef.current || {}

    if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details } = lmsSettingsErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveSchoolHolidaysResp && preSaveSchoolHolidaysRespResp !== saveSchoolHolidaysResp) {
      toast.success("Holidays Added successfully")
      getSchoolHolidaysApiCall();
      closeSchoolHolidaysModal();
    }
    else if (deleteSchoolHolidaysResp && prevDeleteSchoolHolidaysResp !== deleteSchoolHolidaysResp) {
      toast.success("Holidays Deleted successfully")
      getSchoolHolidaysApiCall();
      closeDelSchoolHolidaysYearModal();
    }
    schoolHolidaysRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    schoolHolidaysRef.current.preSaveSchoolHolidaysRespResp = saveSchoolHolidaysResp;
    schoolHolidaysRef.current.prevDeleteSchoolHolidaysResp = deleteSchoolHolidaysResp;
  }, [lmsSettingsErrorAct, saveSchoolHolidaysResp, deleteSchoolHolidaysResp])


  useEffect(() => {
    if (schoolHolidaysFormik.values.academicYearId) {
      getSchoolHolidaysApiCall();
    }
  }, [
    schoolHolidaysFormik.values.academicYearId,
    schoolHolidaysFormik.values.holidayName
  ]);

  useEffect(() => {
      getAcademicYearDetailsApiCall();
  }, []);

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        schoolHolidaysFormik.setFieldValue(
          "academicYearId",
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
          dispatch(getSchoolHolidaysByIdAct(generateActionPayload("get_school_holidays_by_id", { id })));
          openSchoolHolidaysModal(id);
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
          openDelSchoolHolidaysModal(id);
        },
      },
    ],
    [getSchoolHolidaysListResp]
  );

  function delModalSubmitHndlr() {
    dispatch(deleteSchoolHolidaysAct(generateActionPayload("delete_school_holidays_by_id", { id: delSchoolHolidaysModalState.modalData })));
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getSchoolHolidaysListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                School Working Days & Special Holidays
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => openSchoolHolidaysModal()}
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
              <div className="col-xs-12 col-md-4">
                <div className="search-box">
                  <TextInput
                    name="holidayName"
                    labelText="Search"
                    value={schoolHolidaysFormik.values.holidayName}
                    onChange={schoolHolidaysFormik.handleChange}
                    formgroupClassName="mb-0"
                    floatingLabel
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
              <div className="col-xs-12 col-md-4">
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={schoolHolidaysFormik.values.academicYearId}
                  onChange={schoolHolidaysFormik.handleChange}
                  onBlur={schoolHolidaysFormik.handleBlur}
                  menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                  valueKey="id"
                  textKey="courseAcademicYearName"
                  formgroupClassName="mb-0"
                  isDisabled
                  floatingLabel
                  invalid={(schoolHolidaysFormik.touched.academicYearId && schoolHolidaysFormik.errors.academicYearId) ? true : false}
                  error={(schoolHolidaysFormik.touched.academicYearId && schoolHolidaysFormik.errors.academicYearId) ? schoolHolidaysFormik.errors.academicYearId : ""}
                />
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={
              Array.isArray(getSchoolHolidaysListResp)
                ? getSchoolHolidaysListResp
                : []
            }
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={schoolHolidaysModalState.showModal}
        toggle={closeSchoolHolidaysModal}
        modalTitle={
          schoolHolidaysModalState.modalData
            ? "Edit School Holidays & Special Days"
            : "Add School Holidays & Special Days"
        }
        modalSize="md"
      >
        <AddSchoolHolidaysModal
          toggle={closeSchoolHolidaysModal}
          id={schoolHolidaysModalState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delSchoolHolidaysModalState.showModal}
        confirmMessage="Are you sure you want to Delete the School Holidays & Special Days"
        cancelHndlr={closeDelSchoolHolidaysYearModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SchoolHolidays;
