import { useMemo, useState } from "react";
import {
  BrowseFile,
  TextArea,
} from "../../../../../../../../Components/Common";
import UpdatedHorizontalTab from "../../../../../../../../Components/Common/UpdatedHorizontalTab";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const Feedback = () => {
  const [feedback, setFeedback] = useState("");

  return (
    <div>
      <TextArea
        name="feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        labelText="Give Feedback"
        showRemainingChars
        maxLength={100}
        inputClassName="!tw-h-[102px]"
        placeHolder="Write your feedback here..."
        labelClass="required text-muted fs-12"
      ></TextArea>
    </div>
  );
};
const FileUpload = () => {
  return (
    <div>
      <BrowseFile
        name="document"
        labelText="Add Attached files here."
        labelClass="text-muted fs-12"
      ></BrowseFile>
    </div>
  );
};

const FeedbackOffcanavsContainer = () => {
  const [activeId, setActiveId] = useState<any>("feedback");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "feedback",
      labelName: "Feedback",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "fileUpload",
      labelName: "Attach File",
      customPadding: "0px 10px 10px 10px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "feedback":
        return Feedback;
      case "fileUpload":
        return FileUpload;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <>
      <div className="modal-body">
        <div className="tw-bg-[#E8EDFE] tw-border tw-border-[#B4C3F5] tw-rounded tw-p-3 tw-py-4 tw-mb-4">
          <p className="tw-mb-2 tw-text-base tw-font-semibold">Score Summary</p>
          <div className="tw-grid tw-gap-y-1 tw-border-b-2 tw-border-b-[#405189] tw-pb-2">
            <div className="tw-flex tw-justify-between">
              <p className="tw-mb-0 tw-text-[#5268B0]">Question 1:</p>
              <p className="tw-mb-0 tw-text-[#5268B0]">10/10</p>
            </div>
            <div className="tw-flex tw-justify-between">
              <p className="tw-mb-0 tw-text-[#5268B0]">Question 2:</p>
              <p className="tw-mb-0 tw-text-[#5268B0]">8/10</p>
            </div>
            <div className="tw-flex tw-justify-between">
              <p className="tw-mb-0 tw-text-[#5268B0]">Question 3:</p>
              <p className="tw-mb-0 tw-text-[#5268B0]">0/10</p>
            </div>
          </div>
          <div className="tw-pt-3">
            <div className="tw-flex tw-justify-between">
              <p className="tw-mb-0 tw-text-[#405189]">Total :</p>
              <p className="tw-mb-0 tw-text-[#405189]">18/30</p>
            </div>
            <div className="tw-flex tw-justify-between">
              <p className="tw-mb-0 tw-text-[#405189]">Percentage :</p>
              <p className="tw-mb-0 tw-text-[#405189]">60%</p>
            </div>
          </div>
        </div>
        {/* <div>
          <TextArea
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            labelText="Give Feedback"
            showRemainingChars
            maxLength={100}
            inputClassName="!tw-h-[102px]"
            placeHolder="Write your feedback here..."
            labelClass="required text-muted fs-12"
          ></TextArea>
        </div>
        <div className="tw-mb-4">
          <BrowseFile
            name="document"
            labelText="Add Attached files here."
            labelClass="text-muted fs-12"
          ></BrowseFile>
        </div> */}
        <div className="tw-mb-4">
          <UpdatedHorizontalTab
            MenuOptions={MenuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeId}
            horizontalClass="horizontal-menu-updated-style !tw-w-fit"
          />
        </div>
        <div className="tw-mb-4">{activeComponent}</div>
        <div className="tw-flex tw-justify-end tw-mb-4">
          <button className="tw-bg-[#405189] tw-px-3 tw-py-2 tw-rounded tw-text-white">
            Save Feedback
          </button>
        </div>
      </div>
      <div className="modal-footer tw-flex tw-justify-center tw-items-center tw-gap-x-3">
        <div>
          <button className="btn btn-success">Submit Final Grade</button>
        </div>
        <div>
          <button className="btn btn-light">Save as Draft</button>
        </div>
      </div>
    </>
  );
};
export default FeedbackOffcanavsContainer;
