import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Row,
  Col,
  Input,
  ModalFooter,
} from "reactstrap";
import classnames from "classnames";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns, branchData } from "./helper";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Modal Component
import AddSubject from "./AddSubject";
import SubjectCard from "./SubjectCard";
import Button from "../../../Components/Common/Button";
interface IBranchModal {
  showModal: boolean;
}

interface IBranchState {
  isListMode: boolean;
}

const Branch = () => {
  const [subjectModalState, setSubjectModalState] = useState<IBranchModal>({
    showModal: false,
  });
  const history = useHistory();
  const [viewState, setViewState] = useState<IBranchState>({
    isListMode: true,
  });

  const editBranchHndlr = () => { };

  function addSubjectHndlr() {
    setSubjectModalState((prevState) => ({ ...prevState, showModal: true }));
  }
  function toggleBranchModal() {
    setSubjectModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }

  const configurationHandler = useCallback(() => {
    history.push("/master-setup/branch-setting");
  }, []);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        // onClick: () => { },
      },
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        // onClick: () => { },
      },
      {
        id: "configuration",
        actionIcon: <i className="text-warning ri-settings-5-fill fs-16"></i>,
        actionName: "Configuration",
        onClick: configurationHandler,
      },
    ],
    []
  );

  function branchViewHandler(event: React.MouseEvent<HTMLElement>) {
    const viewMode = event.currentTarget.getAttribute("data-view");
    setViewState((prevState) => ({
      ...prevState,
      isListMode: viewMode === "list",
    }));
  }

  const branchColumns = useMemo(() => generateColumns(menuOptions), []);
  return (
    <React.Fragment>
      <div className="tw-p-6">

        <BreadCrumb title="Subject Management" pageTitle="Academics" />

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">
          <div className="tw-p-4 tw-border-b tw-rounded-t-xl">
            <div className="tw-flex tw-flex-wrap tw-gap-4 tw-items-center">

              <div className="tw-w-full sm:tw-w-40">
                <Input
                  type="select"
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
                  <option>Curriculum</option>
                </Input>
              </div>

              <div className="tw-w-full sm:tw-w-40">
                <Input
                  type="select"
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                >
                  <option>Third Class</option>
                </Input>
              </div>

              <div className="tw-ml-auto">
                <Button
                  onClick={addSubjectHndlr}
                  variant="primary"
                >
                  Add Subject
                </Button>
              </div>

            </div>
          </div>
        </div>

        {viewState.isListMode && (
          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">
            <div className="tw-p-0">
              <TableContainer
                columns={branchColumns}
                data={branchData}
                divClass="tw-overflow-x-auto tw-mb-1"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              />
            </div>
          </div>
        )}

        {!viewState.isListMode && (
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-mt-4">
            {branchData.map((item, index) => (
              <SubjectCard branchDetails={item} key={index} />
            ))}
          </div>
        )}

        <Modal
          id="showModal"
          isOpen={subjectModalState.showModal}
          toggle={toggleBranchModal}
          centered
          size="md"
        >
          <ModalHeader
            toggle={toggleBranchModal}
            className="tw-bg-gray-100 tw-p-3"
          >
            Add Subject
          </ModalHeader>

          <ModalBody className="tw-p-0">
            <AddSubject />
          </ModalBody>

          <ModalFooter>
            <div className="tw-flex tw-gap-2 tw-justify-end">
              <Button
                type="button"
                onClick={toggleBranchModal}
                variant="secondary"
              >
                Close
              </Button>

              <Button
                type="submit"
                variant="primary"
              >
                Submit
              </Button>
            </div>
          </ModalFooter>
        </Modal>

      </div>
    </React.Fragment>
  );
};

export default Branch;
