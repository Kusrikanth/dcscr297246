import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { ModalContainerUpdated, TextArea } from "../../Components/Common";
import Button from "../../Components/Common/Button";
import { getUserImgIcon } from "../../utility/commonutility";
import { IPortalTask } from "./helper";

interface ITaskCommentsModalProps {
  isOpen: boolean;
  task: IPortalTask;
  toggle: () => void;
  onAddComment: (comment: string) => void;
}

const TaskCommentsModal: React.FC<ITaskCommentsModalProps> = ({
  isOpen,
  task,
  toggle,
  onAddComment,
}) => {
  const [comment, setComment] = useState("");
  const comments = task.comments || [];

  return (
    <ModalContainerUpdated
      id="ui-task-comments-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="Action comments"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">{task.title}</p>

        {comments.length > 0 && (
          <div className="tw-flex tw-flex-col tw-gap-3 tw-mb-3 tw-max-h-52 tw-overflow-y-auto">
            {comments.map((item) => (
              <div key={item.id} className="tw-flex tw-items-start tw-gap-2">
                <span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-8 tw-h-8 tw-flex-shrink-0 tw-bg-gray-100 tw-text-xs tw-font-semibold">
                  {getUserImgIcon(item.author)}
                </span>
                <div className="tw-min-w-0">
                  <strong className="tw-text-sm">
                    {item.author}
                    <small className="tw-text-gray-500 tw-ms-2 tw-font-normal">
                      {item.createdAt}
                    </small>
                  </strong>
                  <p className="tw-text-sm tw-mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <TextArea
          name="taskComment"
          labelText="Add comment"
          value={comment}
          height="7rem"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setComment(event.target.value)
          }
          placeHolder="Write a progress update or comment"
          helperText="Adding a comment will not close this action."
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!comment.trim()}
          onClick={() => onAddComment(comment.trim())}
        >
          Add comment
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default TaskCommentsModal;
