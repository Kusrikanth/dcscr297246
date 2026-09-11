import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteAcademicTermDetailsAct, getAcademicDetailsListAct, getAcademicTermDetailsByIdAct, getAcademicTermDetailsListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import AddAcademicTermDetailsModal from "./AddAcademicTermDetailsModal";
import * as Yup from "yup";

const initialValues = {
  courseAcademicYearId: ""
}

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
});

const AcademicTermDetails = () => {
  const { openModal: openAcademicTermDetailsModal, closeModal: closeAcademicTermDetailsModal, modalState: academicTermDetailsModalState } = useModal();
  const { openModal: openDelAcademicTermDetailsModal, closeModal: closeDelAcademicTermDetailsModal, modalState: delAcademicTermDetailsModalState, } = useModal();
  const dispatch = useAppDispatch();

  const getAcademicTermDetailsApiCall = (otherProps?: any) => {
    let payload = {
      courseAcademicYearId: addAcademicTermDetailsFormik.values.courseAcademicYearId
    };
    dispatch(getAcademicTermDetailsListAct(generateActionPayload("get_academic_term_details_list", undefined, payload)));
  };

  const getAcademicYearDetailsApiCall = (otherProps?: any) => {
    let payload = {
    };
    dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
  };

  const addAcademicTermDetailsFormik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
    },
  });

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getAcademicTermDetailsListResp,
    saveAcademicTermDetailsResp,
    deleteAcademicTermDetailsResp,
    getAcademicDetailsListResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({ appData, lmsSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getAcademicTermDetailsListResp: lmsSettings.getAcademicTermDetailsListResp,
      saveAcademicTermDetailsResp: lmsSettings.saveAcademicTermDetailsResp,
      deleteAcademicTermDetailsResp: lmsSettings.deleteAcademicTermDetailsResp,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const academicTermDetailsRef = useRef({
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevSaveAcademicTermDetailsResp: saveAcademicTermDetailsResp,
    prevDeleteAcademicTermDetailsResp: deleteAcademicTermDetailsResp,
  })

  useEffect(() => {
    const { prevLmsSettingsErrorAct, prevSaveAcademicTermDetailsResp, prevDeleteAcademicTermDetailsResp } = academicTermDetailsRef.current || {}
    if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details } = lmsSettingsErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveAcademicTermDetailsResp && prevSaveAcademicTermDetailsResp !== saveAcademicTermDetailsResp) {
      toast.success("Academic Term Details Added successfully")
      getAcademicTermDetailsApiCall();
      closeAcademicTermDetailsModal();
    }
    else if (deleteAcademicTermDetailsResp && prevDeleteAcademicTermDetailsResp !== deleteAcademicTermDetailsResp) {
      toast.success("Academic Term Details Deleted successfully")
      getAcademicTermDetailsApiCall();
      closeDelAcademicTermDetailsModal();
    }
    academicTermDetailsRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    academicTermDetailsRef.current.prevSaveAcademicTermDetailsResp = saveAcademicTermDetailsResp;
    academicTermDetailsRef.current.prevDeleteAcademicTermDetailsResp = deleteAcademicTermDetailsResp;
  }, [lmsSettingsErrorAct, saveAcademicTermDetailsResp, deleteAcademicTermDetailsResp])

  useEffect(() => {
    if (addAcademicTermDetailsFormik.values.courseAcademicYearId) {
      getAcademicTermDetailsApiCall();
    }
  }, [addAcademicTermDetailsFormik.values.courseAcademicYearId]);

  useEffect(() => {
      getAcademicYearDetailsApiCall();
  }, []);

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        addAcademicTermDetailsFormik.setFieldValue(
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
          dispatch(getAcademicTermDetailsByIdAct(generateActionPayload("get_academic_term_details_by_id", { id })));
          openAcademicTermDetailsModal(id);
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
          openDelAcademicTermDetailsModal(id);
        },
      },
    ],
    [getAcademicTermDetailsListResp]
  );

  function delModalSubmitHndlr() {
    dispatch(deleteAcademicTermDetailsAct(generateActionPayload("delete_academic_term_details_by_id", { id: delAcademicTermDetailsModalState.modalData })));
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getAcademicTermDetailsListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Academic Term Details
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => openAcademicTermDetailsModal()}
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
                      value={addAcademicTermDetailsFormik.values.courseAcademicYearId}
                      onChange={addAcademicTermDetailsFormik.handleChange}
                      onBlur={addAcademicTermDetailsFormik.handleBlur}
                      menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                      valueKey="id"
                      textKey="courseAcademicYearName"
                      formgroupClassName="mb-0"
                      floatingLabel
                      isDisabled
                      invalid={(addAcademicTermDetailsFormik.touched.courseAcademicYearId && addAcademicTermDetailsFormik.errors.courseAcademicYearId) ? true : false}
                      error={(addAcademicTermDetailsFormik.touched.courseAcademicYearId && addAcademicTermDetailsFormik.errors.courseAcademicYearId) ? addAcademicTermDetailsFormik.errors.courseAcademicYearId : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(getAcademicTermDetailsListResp) ? getAcademicTermDetailsListResp : []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          ></TableContainer>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={academicTermDetailsModalState.showModal}
        toggle={closeAcademicTermDetailsModal}
        modalTitle={
          academicTermDetailsModalState.modalData
            ? "Edit Academic Term Details"
            : "Add Academic Term Details"
        }
        modalSize="md"
      >
        <AddAcademicTermDetailsModal
          toggle={closeAcademicTermDetailsModal}
          id={academicTermDetailsModalState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delAcademicTermDetailsModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Academic Term Details"
        cancelHndlr={closeDelAcademicTermDetailsModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default AcademicTermDetails;
