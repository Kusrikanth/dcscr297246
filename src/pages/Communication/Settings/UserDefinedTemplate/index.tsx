import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, UserDefinedTemplateTableData, } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../../hooks/modalhook";
import AddUserDefinedTemplateModal from "./AddUserDefinedTemplateModal";
import classnames from "classnames";
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  search: "",
};

const UserDefinedTemplate = () => { 
    const history=useHistory();
  const [examinationName, setExaminationName] = useState(initialValues);
  const { closeModal: closeUserDefinedTemplateModal, modalState: userDefinedTemplateState, openModal: openUserDefinedTemplateModal } = useModal();
  const userDefinedTemplateForm = useFormik({
    enableReinitialize: true,
    initialValues: examinationName,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
      },
      {
        id: "view",
        actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />
        ,
        actionName: "View Details",
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

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="tw-inline-block tw-w-full">
        <form onSubmit={userDefinedTemplateForm.handleSubmit}>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3">

            {/* Search */}
            <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
              <div className="tw-relative">
                <div className="search-box">
                  <TextInput
                    name="search"
                    formgroupClassName="tw-mb-0"
                    placeHolder="Search..."
                    value={userDefinedTemplateForm.values.search}
                    onChange={userDefinedTemplateForm.handleChange}
                  />
                  <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                </div>
              </div>
            </div>

            {/* Add New */}
            <div className="md:tw-col-span-12 lg:tw-col-span-7 xl:tw-col-span-8 tw-ml-auto">
              <Button
                type="button"
                onClick={openUserDefinedTemplateModal}
                variant="primary"
              >
                <i className="ri-add-line tw-mr-2" />
                Add New
              </Button>
            </div>

            {/* Export */}
            <div className="tw-col-auto">
              <Button
              variant="info"
                type="button"
              >
                <span>Export</span>
              </Button>
            </div>
          </div>
        </form>

        <TableContainer
          columns={columns || []}
          data={UserDefinedTemplateTableData}
          tableClass="tw-mb-0"
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={10}
          callbackPaginationHndlr={() => { }}
          currentPageNumber={1}
        />
      </div>
      <ModalContainerUpdated
        id="book-collection"
        isOpen={userDefinedTemplateState.showModal}
        toggle={closeUserDefinedTemplateModal}
        modalTitle={"Compose New Messsage"}
        modalSize="xl"
      >
        <AddUserDefinedTemplateModal
          id={userDefinedTemplateState.modalData}
          isOpen={false}
          toggle={closeUserDefinedTemplateModal}
          modalTitle="Compose New Messsage"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default UserDefinedTemplate;
