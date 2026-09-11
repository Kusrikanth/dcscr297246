import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import SelectedQuestionsCard from "./QuestionList";
import { ModalContainerUpdated } from "../../../../../../Components/Common";
import { useModal } from "../../../../../../hooks/modalhook";
import EditMarksModal from "./EditQuestion";
import PreviewQuestion from "../AllQuestionsNew/PreviewQuestion";
import { useAppDispatch } from "../../../../../../hooks/storehook";
import { getQuestionBankByIdAct } from "../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { ModalBody, ModalFooter } from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import classnames from "classnames";

const ViewQuestions = (props: any) => {  
  const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();
  const { closeModal: closeFetchQuestionsModal1, modalState: fetchQuestionsState1, openModal: openFetchQuestionsModal1 } = useModal();
  const { closeModal: closePreviewAllModal, modalState: previewAllModalState, openModal: openPreviewAllModal } = useModal();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Normalize API response when it comes in
  useEffect(() => {
    if (props.getAssessmentQuestionsByIdResp && Array.isArray(props.getAssessmentQuestionsByIdResp)) {
      const mappedData = props.getAssessmentQuestionsByIdResp.map((q: any) => {
        let parsedDescription = q.questionDescription;
        try {
          const parsedJSON = JSON.parse(q.questionDescription);
          if (parsedJSON?.content?.[0]?.content?.[0]?.text) {
            parsedDescription = parsedJSON.content[0].content[0].text;
          }
        } catch {
          // leave as-is if not valid JSON
        }

        // Use marks from API response directly, or calculate from questionBankOptionDTOS if available
        let questionMarks = q.marks;    
        
        // If marks is not available or is 0, try to calculate from questionBankOptionDTOS
        if (!questionMarks && q.questionBankOptionDTOS && Array.isArray(q.questionBankOptionDTOS)) {     
          questionMarks = q.questionBankOptionDTOS.reduce((sum: number, option: any) => 
            sum + (option.allocatedMarks ?? 0), 0) || 0;
        }

        // If still no marks and questionOptions exists, calculate from that
        if (!questionMarks && q.questionOptions && Array.isArray(q.questionOptions)) {       
          questionMarks = q.questionOptions.reduce((sum: number, option: any) => 
            sum + (option.allocatedMarks ?? 0), 0) || 0;
        }

        return {
          id: q.questionId,
          questionTitle: q.questionTitle,
          questionDescription: q.questionDescription, // Keep the full JSON for MathPreview
          description: parsedDescription,
          marks: questionMarks,
          questionOrder: q.questionOrder,
          questionTypeName: q.questionTypeName,
          difficultyLevelName: q.difficultyLevelName,
          duration: q.duration,
          questionOptions: q.questionBankOptionDTOS || q.questionOptions || [], // Handle both field names
          isSelectedStudent: false,
          errors: {},
          customMarks: undefined // Initialize customMarks as undefined
        };
      });            
      props.setSelectedStudentData(mappedData);
    }
  }, [props.getAssessmentQuestionsByIdResp]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    const updatedData = props.selectedStudentData.filter((item: any) => item.id !== questionId);
    props.setSelectedStudentData(updatedData);
    toast.success("Question removed from assessment!");
  }, [props.selectedStudentData]);
 const { onPreviewAll } = props;

 const handlePreviewQuestion = useCallback((question: any) => { 
     openFetchQuestionsModal1(question?.id);
     dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: question?.id })));
 }, []);

  const handleMarksChange = useCallback((questionId: string, marks: string) => {
    const updatedData = props.selectedStudentData.map((item: any) =>
      item.id === questionId
        ? { ...item, marks: marks }
        : item
    );
    props.setSelectedStudentData(updatedData);
  }, [props.selectedStudentData]);

  // New callback for handling edit marks
  const handleEditMarks = useCallback((question: any) => {
    openFetchQuestionsModal(question);
  }, [openFetchQuestionsModal]);

  // New callback for saving custom marks
  const handleSaveCustomMarks = useCallback((questionId: string, customMarks: number) => {
    const updatedData = props.selectedStudentData.map((item: any) =>
      item.id === questionId
        ? { ...item, customMarks: customMarks }
        : item
    );
    props.setSelectedStudentData(updatedData);
    toast.success("Question marks updated successfully!");
  }, [props.selectedStudentData]);

  const handleQuestionsReorder = useCallback((reorderedQuestions: any[]) => {
    props.setSelectedStudentData(reorderedQuestions);
  }, [props.setSelectedStudentData]);

  const handleOpenPreviewAll = () => {
    setCurrentIndex(0);
    if (props.selectedStudentData.length > 0) {
      const firstQuestionId = props.selectedStudentData[0]?.id;
      dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: firstQuestionId })));
    }
    openPreviewAllModal();
  };

  useEffect(() => {
    if (onPreviewAll) {
      onPreviewAll(handleOpenPreviewAll);
    }
  }, [onPreviewAll, handleOpenPreviewAll]);


  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < props.selectedStudentData.length) {
      setCurrentIndex(nextIndex);
      const nextQuestionId = props.selectedStudentData[nextIndex]?.id;
      dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: nextQuestionId })));
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
      const prevQuestionId = props.selectedStudentData[prevIndex]?.id;
      dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: prevQuestionId })));
    }
  };

  return (
    <>
      <div className="row px-3 py-3 g-3 examination tw-min-h-[520px] tw-max-h-[520px]">
       
        <div style={{ "minHeight": "530px", "maxHeight": "530px", "overflowY": "auto", "overflowX": "hidden", width: "100%" }}>

        <SelectedQuestionsCard
          questions={props.selectedStudentData}
          onDeleteQuestion={handleDeleteQuestion}
          onPreviewQuestion={handlePreviewQuestion}
          onMarksChange={handleMarksChange}
          onQuestionsReorder={handleQuestionsReorder}
          onEditMarks={handleEditMarks} // Pass the new callback
          // onPreviewQuestion={handlePreviewQuestion}

        />
        </div>
        {props.selectedStudentData.length > 0 && (
          <div className="col-auto !tw-pl-0">
            {/* <button
              type="button"
              className="btn btn-danger"
              onClick={() => props.setSelectedStudentData([])}
            >
              Remove All
            </button> */}
          </div>
        )}
      </div>

      <ModalContainerUpdated
        id="edit-marks-modal"
        isOpen={fetchQuestionsState.showModal}
        toggle={() => closeFetchQuestionsModal()}
        modalTitle="Edit Question Marks"
        modalSize="md"
      >
        <EditMarksModal
          question={fetchQuestionsState.modalData}
          onSave={handleSaveCustomMarks}
          onClose={() => closeFetchQuestionsModal()}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={fetchQuestionsState1.showModal}
        toggle={() => closeFetchQuestionsModal1()}
        modalTitle="Preview Question"
        modalSize="lg"
      >
        <PreviewQuestion
          id={fetchQuestionsState1.modalData}
          isOpen={false}
          toggle={() => closeFetchQuestionsModal1()}
          modalTitle="Preview Question"
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="preview-all-modal"
        isOpen={previewAllModalState.showModal}
        toggle={() => closePreviewAllModal()}
        modalTitle={`Preview Questions (${currentIndex + 1} of ${props.selectedStudentData.length})`}
        modalSize="lg"
      >

        <PreviewQuestion
          id={props.selectedStudentData[currentIndex]?.id}
          isOpen={true}
          toggle={() => { }}
          modalTitle=""
        />

        <div className="tw-flex tw-justify-center tw-mt-auto tw-gap-3 tw-mb-8">
          <button
            className={classnames(
              "tw-bg-[#F3F4F6] tw-text-[#374151] tw-text-sm tw-font-medium tw-px-3 tw-py-1.5 tw-rounded tw-shadow-sm hover:!tw-bg-gray-200 tw-flex tw-items-center tw-justify-center",
              {
                "tw-opacity-70 tw-cursor-not-allowed": currentIndex === 0,
              }
            )}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="tw-me-2"
              size={16}
            />
            Previous
          </button>
          <button
            className={classnames(
              "tw-bg-[#0ab39c] tw-text-white tw-flex tw-items-center tw-justify-centers tw-font-medium tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-[#099885] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed",
              {
                "tw-opacity-50 tw-cursor-not-allowed": currentIndex === props.selectedStudentData.length - 1,
              }
            )}
            onClick={handleNext}
            disabled={currentIndex === props.selectedStudentData.length - 1}
          >
            Next
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="tw-ms-2"
              size={16}
            />
          </button>
        </div>
      </ModalContainerUpdated>
    </>
  );
};

export default ViewQuestions;