import { HugeiconsIcon } from "@hugeicons/react";
import studentImg from "../../../../../../../../assets/imagesdps/student-default-img.png";
import { Tick01Icon, Time02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useMemo, useState } from "react";
import StudentAnswerList from "./StudentAnswerList";

import FeedbackOffcanavsContainer from "./FeedbackOffcanavsContainer";
import StudentAnswerListTwo from "./StudentAnswerListTwo";
import UpdatedHorizontalTab from "../../../../../../../../Components/Common/UpdatedHorizontalTab";
import { ModalContainerUpdated } from "../../../../../../../../Components/Common";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const SelectedStudentAssessment = () => {
  const [activeId, setActiveId] = useState<any>("homeWork");
  const [openOffCanvas, setOpenOffCanvas] = useState(false);
  const [markNow, setMarkNow] = useState(false);

  const toggleOffCanvas = () => {
    setOpenOffCanvas((prev) => !prev);
  };

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "homeWork",
      labelName: "Home Work",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "classWork",
      labelName: "Class Work",
      customPadding: "0px 10px 6px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "homeWork":
        return StudentAnswerList;
      case "classWork":
        return StudentAnswerListTwo;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent markNow={markNow} />;
  }, [activeId, markNow]);

  function toggleMarkNow() {
    console.log();
    setMarkNow(!markNow);
  }

  return (
    <>
      <div className="card">
        <div className="card-header tw-flex tw-justify-between">
          <div className="tw-flex tw-items-center">
            <div className="tw-w-[68px] tw-h-[68px] tw-rouned-circle tw-shrink-0 tw-me-4">
              <img
                src={studentImg}
                className="tw-rouned-circle tw-h-full tw-w-full"
                alt="student img"
              ></img>
            </div>
            <div>
              <p className="tw-mb-1 tw-text-xl tw-font-semibold">
                Sarah Johnson
              </p>
              <div className="tw-flex tw-gap-x-3 tw-items-center">
                <p className="tw-mb-0 tw-rounded-full tw-text-[#1E40AF] tw-bg-[#DBEAFE] tw-py-1 tw-px-2 tw-text-semibold tw-flex tw-items-center tw-justify-center">
                  <HugeiconsIcon
                    icon={Time02Icon}
                    className="tw-me-2"
                    size={16}
                  />
                  Submitted
                </p>
                <p className="tw-text-gray-500 tw-mb-0 tw-font-semibold">
                  2 hours ago
                </p>
              </div>
            </div>
          </div>
          {activeId !== "classWork" && (
            <div className="tw-flex tw-items-center tw-gap-x-6">
              <div className="tw-text-end">
                <p className="tw-mb-0 tw-text-gary-500 tw-font-semibold">
                  Total Score
                </p>
                <p className="tw-flex tw-gap-x-2 tw-items-center tw-mb-0 tw-text-3xl tw-font-semibold">
                  <span className="tw-border-b-2 tw-border-black tw-px-4 ">
                    0
                  </span>
                  <span>/</span>
                  <span>100</span>
                </p>
              </div>
              <button
                className="btn btn-success d-flex align-items-center justify-content-center px-3 py-2 fs-16"
                onClick={toggleOffCanvas}
              >
                <HugeiconsIcon
                  icon={Tick01Icon}
                  className="tw-me-2"
                  size={22}
                />
                Grade
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-8">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass=""
              />
            </div>
            {activeId !== "classWork" && (
              <div className="col-auto ms-auto">
                <button
                  className="btn btn-success"
                  // onClick={() => setMarkNow((prev) => !prev)}
                  onClick={toggleMarkNow}
                >
                  Mark Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">{activeComponent}</div>

      <ModalContainerUpdated
        id="feedback-offcanavs-container"
        isOpen={openOffCanvas}
        toggle={toggleOffCanvas}
        modalTitle="Score & Feedback"
        modalSize="md"
      >
        <FeedbackOffcanavsContainer></FeedbackOffcanavsContainer>
      </ModalContainerUpdated>
    </>
  );
};

export default SelectedStudentAssessment;
