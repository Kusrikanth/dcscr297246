import { HugeiconsIcon } from "@hugeicons/react";
import classnames from "classnames";
import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  ClockIcon,
  PlusSignIcon,
  SettingDone03Icon,
} from "@hugeicons-pro/core-stroke-standard";
import AddCourse from "./AddCourse";
import { useModal } from "../../../../hooks/modalhook";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const labelType = {
  InProgress: { colorCode: "bg-warning", icon: ClockIcon },
  Completed: { colorCode: "bg-success", icon: CheckmarkCircle02Icon },
  NotStarted: { colorCode: "bg-danger", icon: AlertCircleIcon },
};

export const dummyAssessments = [
  {
    id: 1,
    bgColor: "#FEE2E2",
    icon: <MathsSVG />,
    statusLabel: "Completed",
    title: "Term 1 Math Assessment",
    subjectName: "Mathematics",
    testType: "Online Test",
  },
  {
    id: 2,
    bgColor: "#FEF9C3",
    icon: <MathsSVG />,
    statusLabel: "InProgress",
    title: "Science Quiz - Chapter 3",
    subjectName: "Science",
    testType: "Quiz",
  },
  {
    id: 3,
    bgColor: "#D1FAE5",
    icon: <MathsSVG />,
    statusLabel: "NotStarted",
    title: "English Grammar Practice",
    subjectName: "English",
    testType: "Worksheet",
  },
];

const TeacherAssessmentCardItem = ({ assessment }) => {
  const { bgColor, icon, statusLabel, title, subjectName, testType } =
    assessment;
  const history = useHistory();

  const handleManageClick = () => {
    history.push("/create-course/manage-course");
  };
  return (
    <div className="card border rounded-3 !tw-shadow-none hover:!tw-shadow-[0_1px_2px_rgba(56,65,74,0.15)] mb-0 tw-overflow-hidden">
      <div
        className="position-relative tw-h-[138px] tw-flex tw-items-center tw-justify-center"
        style={{ backgroundColor: `${bgColor}` }}
      >
        <div className="tw-h-[72px] tw-w-[72px]">{icon}</div>

        <p
          className={classnames(
            `badge position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1 ${labelType[statusLabel].colorCode}`
          )}
        >
          {statusLabel}
          <HugeiconsIcon
            icon={labelType[statusLabel].icon}
            className=""
            size={16}
          />
        </p>
      </div>

      <div className="card-body">
        <h5 className="card-title text-truncate mb-2">{title}</h5>
        <div className="card-subtitle mb-3 text-muted text-truncate small fw-medium">
          <span className="d-flex align-items-center">
            {subjectName} | {testType}
          </span>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <button
              type="button"
              className="btn btn-outline-primary w-100 fs-12 px-5"
              onClick={handleManageClick}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddCourseManagement = () => {
  const {
    openModal: addOpenCourseModal,
    closeModal: addCloseCourseModal,
    modalState: addCourseModalState,
  } = useModal();
  const [showCard, setShowCard] = useState(false);
const history = useHistory();
  const toggleCard = () => {
    setShowCard(prev => !prev);
  };
      const moveToAddConcern = (event: any) => {
        event.preventDefault()
        history.push(`${location.pathname}/add-course`, {
            pathName: location.pathname,
        })
    }
  return (
    <>
      {/* <div className="tw-grid tw-gap-5 tw-grid-cols-[repeat(auto-fit,_minmax(248px,_1fr))]"> */}
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="LMS" pageTitle="LMS"></BreadCrumb>
          <div className="">
            <div className="card-header">
              <div className="row">
                <div className='col-8 d-grid align-items-center'>
                  <h4 className="card-title mb-0">
                    Course Management
                  </h4>
                </div>
                <div className='col-auto ms-auto d-flex align-items-center'>
                  <a href="#" className="d-flex align-items-center text-info fs-12">
                    <HugeiconsIcon icon={SettingDone03Icon} className="me-2 text-info" size={20} />
                  </a>
                </div>
              </div>
            </div>
            <div className="py-3">
              {/* <div className="tw-grid tw-gap-5 tw-grid-cols-[repeat(auto-fit,_minmax(248px,_1fr))]"> */}
              <div className="tw-grid tw-gap-5 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xxl:tw-grid-cols-5">
                {dummyAssessments.map((item, idx) => (
                  <TeacherAssessmentCardItem
                    assessment={item}
                    key={item.id}
                  ></TeacherAssessmentCardItem>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="course"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          {showCard && (
            <div style={{
              position: "absolute",
              bottom: "60px",
              right: "0px",
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              fontSize: "14px",
              color: "green",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}>
              <div className="shadow-lg"
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  right: "12px",
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid white",
                  filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))"
                }}
              />
              <button
                className="btn btn-light "
                onClick={moveToAddConcern}
              >
                <span ><HugeiconsIcon icon={PlusSignIcon} size={16} className="hover-scale" /> Add Category</span>
              </button>
            </div>
          )}
          <button
            className="btn btn-success hover-scale"
            onClick={toggleCard}
            style={{
              borderRadius: "50%",
              width: "45px",
              height: "40px",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
          </button>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-course-modal"
        isOpen={addCourseModalState.showModal}
        toggle={addCloseCourseModal}
        modalSize="xl"
        modalTitle="Course Configuration"
      >
        <AddCourse></AddCourse>
      </ModalContainerUpdated>
    </>
  );
};

export default AddCourseManagement;
