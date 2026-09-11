import { HugeiconsIcon } from "@hugeicons/react";

import { Pdf02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../../../../hooks/modalhook";
import {
  BrowseFile,
  ModalContainerUpdated,
  TextArea,
} from "../../../../../../../../Components/Common";

const StudentAnswerListTwo = () => {
  const {
    modalState: viewStudentAttachmentModalState,
    openModal: viewStudentAttachmentOpenModal,
    closeModal: viewStudentAttachmentCloseModal,
  } = useModal();

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="tw-mb-6">
            <p className="tw-text-[#405189] tw-bg-[#E8EDFE] tw-font-medium tw-px-2 tw-py-1 tw-text-base tw-rounded tw-inline-flex tw-items-center tw-justify-center">
              Question
            </p>
            <p className="tw-mb-2 tw-font-semibold tw-text-base">
              Discuss the impact of the British East India Company's policies on
              Indian agriculture, focusing on land revenue systems, the
              introduction of commercial crops, and the resulting social and
              economic consequences for various sections of Indian society.
            </p>

            <div className="tw-text-[#4B5563] tw-bg-[#F3F4F6] tw-px-4 tw-py-3 tw-rounded tw-inline-flex tw-items-center tw-justify-center tw-font-medium">
              <HugeiconsIcon icon={Pdf02Icon} className="tw-me-2" size={24} />
              <span
                className="tw-text-blue-500 tw-underline tw-cursor-pointer"
                onClick={() => {}}
              >
                exam-attachments.pdf
              </span>
            </div>
          </div>

          <div className="tw-mb-8">
            <div>
              <TextArea
                name="feedback"
                value={""}
                onChange={(e) => {}}
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
            </div>
          </div>

          <div className="tw-flex tw-justify-end tw-items-center tw-gap-x-3">
            <div>
              <button className="btn btn-light">Save as Draft</button>
            </div>
            <div>
              <button className="btn btn-success">Submit Final Grade</button>
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="view-student-attachments"
        isOpen={viewStudentAttachmentModalState.showModal}
        toggle={viewStudentAttachmentCloseModal}
        modalSize="lg"
        modalTitle="View Attachment"
      >
        <div className="modal-body"></div>
      </ModalContainerUpdated>
    </>
  );
};

export default StudentAnswerListTwo;
