import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, AoSelectionTableData, selectData1, selectData2, selectData5, selectData6, } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import AoselectionModel from "./AoSelectionModel";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  term: "Term",
  section: "Section",
};

const AoSelection = () => {
  const [AoselectionModelState, setAoselectionModelState] =
    useState({
      showModal: false,
      branchId: "",
    });

  const [aoSelection, setAoSelection] = useState(initialValues);
  const AoSelectionForm = useFormik({
    enableReinitialize: true,
    initialValues: aoSelection,
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

  const toggleAoselectionModel = () => {
    setAoselectionModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={AoSelectionForm.handleSubmit}>
          <div className="row card-body">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <div className="search-box">
                <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={AoSelectionForm.values.search}
                  onChange={AoSelectionForm.handleChange}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="year"
                value={AoSelectionForm.values.year}
                onChange={AoSelectionForm.handleChange}
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
                value={AoSelectionForm.values.class}
                onChange={AoSelectionForm.handleChange}
                menuItems={selectData2}
                valueKey="classType"
                textKey="classType"
                formgroupClassName="mb-0"
                placeHolder="Class"
                labelText = "Class"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="section"
                value={AoSelectionForm.values.section}
                onChange={AoSelectionForm.handleChange}
                menuItems={selectData6}
                valueKey="sectionType"
                textKey="sectionType"
                formgroupClassName="mb-0"
                labelText = "Section"
                floatingLabel
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="term"
                value={AoSelectionForm.values.term}
                onChange={AoSelectionForm.handleChange}
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
                onClick={toggleAoselectionModel}
              >
                <i className="ri-add-line me-2" />
                Add New
              </button>
            </div>
          </div>
        </form>

        <TableContainer
          columns={columns || []}
          data={AoSelectionTableData}
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
        isOpen={AoselectionModelState.showModal}
        toggle={toggleAoselectionModel}
        modalTitle="Ao's Selection"
        modalSize="xl"
      >
        <AoselectionModel
          isOpen={AoselectionModelState.showModal}
          toggle={toggleAoselectionModel}
          modalTitle="Ao's Selection"
          instituteName={"Ao's Selection"}
          branchId={AoselectionModelState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AoSelection;
