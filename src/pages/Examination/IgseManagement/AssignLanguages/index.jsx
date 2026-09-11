import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, StudentSubjectTableData, selectData1, selectData3, } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import AssignLanguageModel from "./AssignLanguageModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
};

const AssignLanguages = () => {
    const [AssignLanguageModelState, setAssignLanguageModelState] =
    useState({
      showModal: false,
      branchId: "",
    });

  const [studentSubject, setstudentSubject] = useState(initialValues);
  const StudentSubjectForm = useFormik({
    enableReinitialize: true,
    initialValues: studentSubject,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClick: () => {},
      },
    ],
    []
  );

  const toggleAssignLanguageModel = () => {
    setAssignLanguageModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={StudentSubjectForm.handleSubmit}>
          <div className="row px-3 g-3 py-3">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={StudentSubjectForm.values.search}
                  onChange={StudentSubjectForm.handleChange}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="year"
                value={StudentSubjectForm.values.year}
                onChange={StudentSubjectForm.handleChange}
                menuItems={selectData1}
                valueKey="yearType"
                textKey="yearType"
                formgroupClassName="mb-0"
                placeHolder="Academic Year"
                labelText = "Academic Year"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="class"
                value={StudentSubjectForm.values.class}
                onChange={StudentSubjectForm.handleChange}
                menuItems={selectData3}
                valueKey="classType"
                textKey="classType"
                formgroupClassName="mb-0"
                placeHolder="Class"
                labelText = "Class"
                floatingLabel
              />
            </div>

            <div className="col-auto ms-auto">
              <button
                className="btn btn-success float-end d-flex align-items-center"
                onClick={toggleAssignLanguageModel}
              >
                <i className="ri-add-line me-2" />
                Add New
              </button>
            </div>
          </div>
        </form>

        <TableContainer
          columns={columns || []}
          data={StudentSubjectTableData}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={10}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={1}
        />
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={AssignLanguageModelState.showModal}
        toggle={toggleAssignLanguageModel}
        modalTitle="Assign Languages"
        modalSize="md"
      >
        <AssignLanguageModel
          isOpen={AssignLanguageModelState.showModal}
          toggle={toggleAssignLanguageModel}
          modalTitle="Assign Languages"
          instituteName={"Assign Languages"}
          branchId={AssignLanguageModelState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AssignLanguages;
