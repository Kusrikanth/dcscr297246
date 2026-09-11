import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, StudentSubjectTableData, selectData1, selectData3, selectData4, selectData5, } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import StudentReviewModel from "./StudentReviewModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  section: "Section",
  term: "Term",
};

const StudentRemarks = () => {

    const [StudentReviewModelState, setStudentReviewModelState] =
    useState({
      showModal: false,
      branchId: "",
    });

  const [studentSubject, setstudentSubject] = useState(initialValues);
  const StudentReview = useFormik({
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

  const toggleStudentReviewModel = () => {
    setStudentReviewModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={StudentReview.handleSubmit}>
          <div className="row px-3 g-3 py-3">
            <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2">
              <div className="search-box">
                <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={StudentReview.values.search}
                  onChange={StudentReview.handleChange}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>

            <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2">
              <SelectInput
                name="year"
                value={StudentReview.values.year}
                onChange={StudentReview.handleChange}
                menuItems={selectData1}
                valueKey="yearType"
                textKey="yearType"
                formgroupClassName="mb-0"
                placeHolder="Academic Year"
                labelText = "Academic Year"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2">
              <SelectInput
                name="class"
                value={StudentReview.values.class}
                onChange={StudentReview.handleChange}
                menuItems={selectData3}
                valueKey="classType"
                textKey="classType"
                formgroupClassName="mb-0"
                placeHolder="Class"
                labelText = "Class"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2">
              <SelectInput
                name="section"
                value={StudentReview.values.section}
                onChange={StudentReview.handleChange}
                menuItems={selectData4}
                valueKey="sectionType"
                textKey="sectionType"
                formgroupClassName="mb-0"
                labelText = "Section"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2">
              <SelectInput
                name="term"
                value={StudentReview.values.term}
                onChange={StudentReview.handleChange}
                menuItems={selectData5}
                valueKey="termType"
                textKey="termType"
                formgroupClassName="mb-0"
                labelText = "Term"
                floatingLabel
              />
            </div>
            <div className="col-auto ms-auto">
              <button
                className="btn btn-success float-end d-flex align-items-center"
                onClick={toggleStudentReviewModel}
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
          showCheckbox={true}
          totalPages={10}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={1}
        />
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={StudentReviewModelState.showModal}
        toggle={toggleStudentReviewModel}
        modalTitle="Student Remarks"
        modalSize="lg"
      >
        <StudentReviewModel
          isOpen={StudentReviewModelState.showModal}
          toggle={toggleStudentReviewModel}
          modalTitle="Student Remarks"
          instituteName={"Student Remarks"}
          branchId={StudentReviewModelState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentRemarks;
