import React, { useState, useMemo, useCallback } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { Tabs } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

//Helper
import { generateColumns, branchData } from "./helper";

//Modal Component
import AssignClassRoom from "./AssignClassRoom";
import AssignTeacher from "./AssignTeacher";
import AssignStudent from "./AssingStudent";
import Button from "../../../Components/Common/Button";

interface IRoomModalState {
  showModal: boolean;
}
interface ITeacherModalState {
  showModal: boolean;
}

const ClassManagement = () => {
  const [roomModalState, setRoomModalState] = useState<IRoomModalState>({
    showModal: false,
  });
  const [teacherModalState, setTeacherModalState] =
    useState<ITeacherModalState>({
      showModal: false,
    });
  const [studentModalState, setStudentModalState] =
    useState<ITeacherModalState>({
      showModal: false,
    });

  const menuOptions = useMemo(
    () => [
      {
        id: "goto-sections",
        actionIcon: (
          <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
        ),
        actionName: "Go To Section",
        // onClick: () => { },
      },
      {
        id: "add-students",
        actionIcon: (
          <i className="ri-add-box-line align-bottom me-2 text-muted"></i>
        ),
        actionName: "Add Students",
        // onClick: () => { },
      },
    ],
    []
  );

  function toggleModalHndlr() {
    setRoomModalState((prevState) => ({ ...prevState, showModal: false }));
    setTeacherModalState((prevState) => ({ ...prevState, showModal: false }));
    setStudentModalState((prevState) => ({ ...prevState, showModal: false }));
  }

  const assignRoomHandler = useCallback(() => {
    setRoomModalState((prevState) => ({ ...prevState, showModal: true }));
  }, []);

  const assignTeacherHndlr = useCallback(() => {
    setTeacherModalState((prevState) => ({ ...prevState, showModal: true }));
  }, []);
  const assignStudentHndlr = useCallback(() => {
    setStudentModalState((prevState) => ({ ...prevState, showModal: true }));
  }, []);

  const classColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        assignRoomHandler,
        assignTeacherHndlr,
        assignStudentHndlr
      ),
    []
  );
  return (
    <React.Fragment>
      <div className="tw-p-6">
        <BreadCrumb title="Classroom Management" pageTitle="Academics" />

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">
          <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-px-6 tw-py-4">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              Classroom Management
            </h4>
          </div>

          <div className="tw-p-0">
            <div className="tw-px-6 tw-py-4">
              <form onClick={(e) => e.preventDefault()}>
                <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-4">
                  <div className="xl:tw-col-span-3">
                    <div className="tw-relative search-box">
                      <Input
                        type="text"
                        className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                        placeholder="Search..."
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>

                  <div className="xl:tw-col-span-2">
                    <Input
                      name="institute"
                      type="select"
                      className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                    >
                      <option value="CBSE">CBSE</option>
                    </Input>
                  </div>

                  <div className="xl:tw-col-span-2">
                    <Input
                      name="institute"
                      type="select"
                      className="tw-w-full tw-bg-gray-100 tw-border tw-border-gray-200 tw-rounded-md tw-px-3 tw-py-2 tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
                    >
                      <option value="seventh-class">Sevent Class</option>
                    </Input>
                  </div>
                </div>
              </form>
            </div>

            <TableContainer
              columns={classColumns || []}
              data={branchData}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showPagination={true}
              totalPages={1}
              totalRecords={10}
              callbackPaginationHndlr={() => {}}
              currentPageNumber={0}
            />
          </div>
        </div>
      </div>
      <Modal
        id="assign-classroom-modal"
        isOpen={roomModalState.showModal}
        toggle={toggleModalHndlr}
        centered
        size="lg"
      >
        <ModalHeader className="bg-light p-3" toggle={toggleModalHndlr}>
          Assign Class Room
        </ModalHeader>
        <ModalBody>
          <AssignClassRoom />
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={toggleModalHndlr}
            >
              Close
            </Button>

            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        id="assign-teacher-modal"
        isOpen={teacherModalState.showModal}
        toggle={toggleModalHndlr}
        centered
        size="md"
      >
        <ModalHeader className="bg-light p-3" toggle={toggleModalHndlr}>
          Assign Class Teacher
        </ModalHeader>
        <ModalBody className="p-0">
          <AssignTeacher />
        </ModalBody>
        <ModalFooter className="mt-3">
          <div className="hstack gap-2 justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={toggleModalHndlr}
            >
              Close
            </Button>

            <Button type="submit" variant="primary">
              Assign
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        id="assign-student-modal"
        isOpen={studentModalState.showModal}
        toggle={toggleModalHndlr}
        centered
        size="md"
      >
        <ModalHeader className="bg-light p-3" toggle={toggleModalHndlr}>
          Assign Class Student
        </ModalHeader>
        <ModalBody className="p-0">
          <AssignStudent />
        </ModalBody>
        <ModalFooter className="mt-3">
          <div className="hstack gap-2 justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={toggleModalHndlr}
            >
              Close
            </Button>

            <Button type="submit" variant="primary">
              Assign
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ClassManagement;
