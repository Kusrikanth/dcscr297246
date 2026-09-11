import React, { useMemo, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  
  getRegistrationInstructionAct,
  getRegistrationInstructionHtmlByIdAct,
  deleteRegistrationInstructionAct,
} from "../../../store/FrontDesk/RegistrationInstruction/registrationinstructionaction";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../Components/Common/ModalContainer";
import AddEditHtmlModal from "./AddEditHtmlModal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, SelectInput } from "../../../Components/Common";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { setRegistrationInstructionAct } from "../../../store/FrontDesk/RegistrationInstruction/registrationinstructionslice";
import { getInstCurriculumAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import * as Yup from "yup";
import { useFormik } from "formik";

const initialValues = {
  branchId: "",
  curriculumId: "",
};

const validationSchema = Yup.object().shape({
  branchId: Yup.string().required("Branch is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
});

const RegistrationInstructions = ({ instituteId }) => {
  const dispatch = useAppDispatch();

  // const [filterState, setFilterState] = useState<any>(initialValues);

  const {
    openModal: addEditHtmlOpenModal,
    closeModal: addEditHtmlCloseModal,
    modalState: addEditHtmlModalState,
  } = useModal();

  const {
    openModal: openDeleteRegistrationInstructionModal,
    closeModal: closeDeleteRegistrationInstructionModal,
    modalState: deleteRegistrationInstructionModalState,
  } = useModal();

  const {
    getRegistrationInstructionResp,
    registrationInstructionErrorResp,
    currentBranchIdResp,
    getRegistrationInstructionHtmlByIdResp,
    updateRegistrationInstructionResp,
    saveRegistrationInstructionResp,
    deleteRegistrationInstructionResp,
    branchListResp,
    instCurriculumResp,
  } = useAppSelector(
    ({ registrationInstruction, appData, branch, instAcademics }) => ({
      getRegistrationInstructionResp:
        registrationInstruction.getRegistrationInstructionResp,
      registrationInstructionErrorResp:
        registrationInstruction.registrationInstructionErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getRegistrationInstructionHtmlByIdResp:
        registrationInstruction.getRegistrationInstructionHtmlByIdResp,
      updateRegistrationInstructionResp:
        registrationInstruction.updateRegistrationInstructionResp,
      saveRegistrationInstructionResp:
        registrationInstruction.saveRegistrationInstructionResp,
      deleteRegistrationInstructionResp:
        registrationInstruction.deleteRegistrationInstructionResp,
      branchListResp: branch.branchListResp,
      instCurriculumResp: instAcademics.instCurriculumResp,
    }),
    shallowEqual
  );
  
  const registrationInstructionForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => { },
  });

  const registrationInstructionRespRef = useRef<any>({
    prevGetRegistrationInstructionResp: getRegistrationInstructionResp,
    prevRegistrationInstructionErrorResp: registrationInstructionErrorResp,
    prevGetRegistrationInstructionHtmlByIdResp:
      getRegistrationInstructionHtmlByIdResp,
    prevUpdateRegistrationInstructionResp: updateRegistrationInstructionResp,
    prevSaveRegistrationInstructionResp: saveRegistrationInstructionResp,
    prevDeleteRegistrationInstructionResp: deleteRegistrationInstructionResp,
  });

  useEffect(() => {
    if (instituteId && !branchListResp) {
      const payload = { instituteId, pageNo: 0, pageSize: 100 };
      dispatch(
        getInstBranchesAct(
          generateActionPayload("get_inst_branches", undefined, payload)
        )
      );
    } else if (
      branchListResp &&
      Array.isArray(branchListResp.data) &&
      branchListResp?.data.length > 0
    ) {
      const { branchId } = branchListResp.data[0];
      if (branchId) {
        getRegistrationInstructionApiCall({ branchId: branchId });
        registrationInstructionForm.setFieldValue("branchId", branchId);
       
      }
    }
  }, [instituteId, branchListResp]);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (value) {
      getRegistrationInstructionApiCall({ [name]: value });
    } else {
      dispatch(setRegistrationInstructionAct(undefined));
    }
    registrationInstructionForm.setFieldValue(name, value);
  }

  function deleteRegistrationInstructionHndlr(
    event: React.MouseEvent<HTMLElement>
  ) {
    const registrationInstructionId =
      event.currentTarget.getAttribute("data-id");
    if (registrationInstructionId) {
      openDeleteRegistrationInstructionModal(registrationInstructionId);
    }
  }

  function delModalSubmitHndlr() {
    const registrationInstructionId =
      deleteRegistrationInstructionModalState.modalData;
    dispatch(
      deleteRegistrationInstructionAct(
        generateActionPayload(
          "delete_registration_instruction",
          { id: registrationInstructionId },
          undefined
        )
      )
    );
  }

  const handleAddClick = async () => {
    const errors = await registrationInstructionForm.validateForm();

    registrationInstructionForm.setTouched({
      branchId: true,
      curriculumId: true,
    });

    if (Object.keys(errors).length === 0) {
      addEditHtmlOpenModal(null);
    }
  };

  useEffect(() => {
    const {
      prevRegistrationInstructionErrorResp,
      prevUpdateRegistrationInstructionResp,
      prevSaveRegistrationInstructionResp,
      prevDeleteRegistrationInstructionResp,
    } = registrationInstructionRespRef.current;
    if (
      updateRegistrationInstructionResp &&
      prevUpdateRegistrationInstructionResp !==
        updateRegistrationInstructionResp
    ) {
      toast.success("Registration instruction updated successfully.");
      getRegistrationInstructionApiCall();
      addEditHtmlCloseModal();
    } else if (
      saveRegistrationInstructionResp &&
      prevSaveRegistrationInstructionResp !== saveRegistrationInstructionResp
    ) {
      toast.success("Registration instruction added successfully.");
      getRegistrationInstructionApiCall();
      addEditHtmlCloseModal();
    } else if (
      deleteRegistrationInstructionResp &&
      prevDeleteRegistrationInstructionResp !==
        deleteRegistrationInstructionResp
    ) {
      toast.success("Registration instruction deleted successfully.");
      getRegistrationInstructionApiCall();
      closeDeleteRegistrationInstructionModal();
    } else if (
      registrationInstructionErrorResp &&
      registrationInstructionErrorResp !== prevRegistrationInstructionErrorResp
    ) {
      const { details }: any = registrationInstructionErrorResp;
      toast.error(details || "Something went wrong.");
    }
    registrationInstructionRespRef.current.prevRegistrationInstructionErrorResp =
      registrationInstructionErrorResp;
    registrationInstructionRespRef.current.prevUpdateRegistrationInstructionResp =
      updateRegistrationInstructionResp;
    registrationInstructionRespRef.current.prevSaveRegistrationInstructionResp =
      saveRegistrationInstructionResp;
    registrationInstructionRespRef.current.prevDeleteRegistrationInstructionResp =
      deleteRegistrationInstructionResp;
  }, [
    registrationInstructionErrorResp,
    updateRegistrationInstructionResp,
    saveRegistrationInstructionResp,
    deleteRegistrationInstructionResp,
  ]);

  function handleEditClick(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    dispatch(
      getRegistrationInstructionHtmlByIdAct(
        generateActionPayload(
          "get_registration_instruction_html_by_id",
          { id },
          undefined
        )
      )
    );
    addEditHtmlOpenModal(id);
  }

  const menuOptions = useMemo(
    (): IOptionsHrtl[] => [
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
        onClickHndlr: handleEditClick,
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
        onClickHndlr: deleteRegistrationInstructionHndlr,
      },
    ],
    []
  );

  useEffect(() => {
    if (instituteId) {
        const params = { instituteId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getInstCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, params)));
    }
}, [instituteId]);

  function getRegistrationInstructionApiCall(otherProps?: any) {
    const payload = {
      branchId: registrationInstructionForm.values.branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(
      getRegistrationInstructionAct(
        generateActionPayload(
          "get_all_registration_isntruction",
          undefined,
          payload
        )
      )
    );
  }

  const registrationColumns = useMemo(
    () => generateColumns(menuOptions),
    [getRegistrationInstructionResp]
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="card-title mb-0 flex-grow-1">
              Registration Instructions
            </h4>
          </div>
          <div className="col ms-auto">
            <button
              className="btn btn-success float-end d-flex align-items-center"
              onClick={handleAddClick}
            >
              <i className="ri-add-fill me-1 align-bottom"></i>
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <SelectInput
              name="branchId"
              value={registrationInstructionForm.values.branchId}
              onChange={onChangeFilterHndlr}
              menuItems={branchListResp?.data}
              formgroupClassName="mb-0"
              labelText="Branch"
              floatingLabel
              valueKey="branchId"
              textKey="branchName"
              labelClass="required"
              invalid={(registrationInstructionForm.touched.branchId && registrationInstructionForm.errors.branchId) ? true : false}
              error={(registrationInstructionForm.touched.branchId && registrationInstructionForm.errors.branchId) ? registrationInstructionForm.errors.branchId : ""}
            />
          </div>
          <div className="col-6 col-lg-3">
            <SelectInput
              name="curriculumId"
              value={registrationInstructionForm.values.curriculumId}
              onChange={onChangeFilterHndlr}
              menuItems={instCurriculumResp?.data}
              // hideSelectOption={true}
              // inputClassName="bg-light"
              formgroupClassName="mb-0"
              valueKey="instituteCurriculumId"
              textKey="curriculumName"
              labelText="Curriculum"
              floatingLabel
                labelClass="required"
                invalid={(registrationInstructionForm.touched.curriculumId && registrationInstructionForm.errors.curriculumId) ? true : false}
                error={(registrationInstructionForm.touched.curriculumId && registrationInstructionForm.errors.curriculumId) ? registrationInstructionForm.errors.curriculumId : ""}
            />
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <TableContainer
          columns={registrationColumns || []}
          data={getRegistrationInstructionResp || []}
          divClass="table-responsive mb-1"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
          // totalPages={totalPages}
          // totalRecords={totalElements}
          // currentPageNumber={pageNumber}
        />
      </div>
      <ModalContainerUpdated
        id="add-edit-html-modal"
        isOpen={addEditHtmlModalState.showModal}
        toggle={addEditHtmlCloseModal}
        modalTitle={
          addEditHtmlModalState.modalData
            ? "Edit Registration Instruction"
            : "Add Registration Instruction"
        }
        modalSize="xl"
      >
        <AddEditHtmlModal
          values={addEditHtmlModalState.modalData || {}}
          toggle={addEditHtmlCloseModal}
          instituteId={instituteId}
          branchId={registrationInstructionForm.values.branchId}
          curriculumId={registrationInstructionForm.values.curriculumId}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-registration-instruction-modal"
        isOpen={deleteRegistrationInstructionModalState.showModal}
        confirmMessage="Are you sure you want to delete this registration instruction ?"
        cancelHndlr={closeDeleteRegistrationInstructionModal}
        confirmHndlr={delModalSubmitHndlr}
      />
    </div>
  );
};

export default RegistrationInstructions;
