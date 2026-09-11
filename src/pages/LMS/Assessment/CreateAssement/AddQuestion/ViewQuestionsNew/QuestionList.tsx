import React from 'react';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, DragDropHorizontalIcon, DragDropVerticalIcon, EyeIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { MathPreview } from '../../../../../../Components/Common';

interface SelectedQuestionsCardProps {
  questions: any[];
  onDeleteQuestion: (questionId: string) => void;
  onPreviewQuestion: (question: any) => void;
  onMarksChange: (questionId: string, marks: string) => void;
  onQuestionsReorder?: (reorderedQuestions: any[]) => void;
  onEditMarks: (question: any) => void;
}

const SortableQuestionItem = ({ 
  id, 
  question, 
  index, 
  onDeleteQuestion, 
  onMarksChange,
  onEditMarks, // Add this prop
  onPreviewQuestion
}: {
  id: string;
  question: any;
  index: number;
  onDeleteQuestion: (questionId: string) => void;
  onMarksChange: (questionId: string, marks: string) => void;
  onEditMarks: (question: any) => void; // Add this prop
  onPreviewQuestion: (question: any) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get marks - prioritize customMarks, then original marks, then calculate from options
  const getDisplayMarks = () => {
    if (question?.customMarks !== undefined) {
      return question.customMarks;
    }
    
    if (question?.marks) {
      return question.marks;
    }
    
    // Fallback calculation from questionOptions
    if (question?.questionOptions && Array.isArray(question.questionOptions)) {
      return question.questionOptions.reduce((sum: number, option: any) => 
        sum + (option.allocatedMarks ?? 0), 0) || 0;
    }
    
    return 0;
  };

  return (
    <div ref={setNodeRef} style={style} className='d-flex'>
      <div className="col-auto d-flex align-items-center">
          <span {...attributes} {...listeners} style={{ cursor: "grab", marginRight: "10px" }}>
            <HugeiconsIcon icon={DragDropVerticalIcon} size={24} color={"#6b7280"} />
          </span>
        </div>
      <div className="row flex justify-between items-center border tw-rounded-lg py-2 shadow-sm mb-3 !tw-w-full !tw-mx-auto  tw-bg-gray-100">

        {/* Left side content */}
        <div className="flex-1 col-9">
          {/* Question Title */}
          <p className="tw-text-sm tw-font-semibold tw-mb-1 tw-flex tw-items-center tw-gap-1">
           <div className='tw-flex tw-items-center'> Q{index + 1}.</div> 
           {question?.questionDescription ? (
             <MathPreview json={JSON.parse(question.questionDescription)} />
           ) : (
             <span>{question?.questionTitle || question?.description || 'No description'}</span>
           )}
          </p>

          {/* Question Details - Show marks properly */}
          <p className="tw-text-xs mb-1 text-muted">
            {getDisplayMarks()} Marks
            <button 
              onClick={() => onEditMarks(question)}
              className="ms-1"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={14} />
            </button>
            {/* {question?.customMarks !== undefined && (
              <span className="text-primary ms-1 fs-10">(Edited)</span>
            )} */}
          </p>
        </div>

        {/* Right side button */}
        <div className="col-2 tw-flex tw-justify-end tw-items-center ">
          <button 
            onClick={() => onPreviewQuestion(question)}
            className="me-2"
          >
           <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />
          </button>
          <button 
            onClick={() => onDeleteQuestion(question.id)}
            className="text-blue-600 hover:text-blue-800 tw-font-semibold px-3 py-2 tw-h-9 rounded hover:bg-blue-50 transition-colors "
          >
           <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectedQuestionsCard: React.FC<SelectedQuestionsCardProps> = ({ 
  questions, 
  onDeleteQuestion, 
  onPreviewQuestion,
  onMarksChange,
  onQuestionsReorder,
  onEditMarks // Add this prop
}) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event || {};
    
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((question) => question.id === active.id);
      const newIndex = questions.findIndex((question) => question.id === over.id);
      
      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex);
      
      if (onQuestionsReorder) {
        onQuestionsReorder(reorderedQuestions);
      }
    }
  };

  return (
    <div className="" style={{ width: "100%" }}>
      {questions.length > 0 ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((question) => question.id)} strategy={verticalListSortingStrategy}>
            <div className="questions-list">
              {questions.map((question, index) => (
                <SortableQuestionItem
                  key={question.id}
                  id={question.id}
                  question={question}
                  index={index}
                  onDeleteQuestion={onDeleteQuestion}
                  onMarksChange={onMarksChange}
                  onEditMarks={onEditMarks} // Pass the prop
                  onPreviewQuestion={onPreviewQuestion}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-gray-500 tw-mt-6 tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center">
          <p className='mb-2'>No questions selected. </p>
          <p className="text-sm">Pick from the list or click Select All.</p>
        </div>
      )}
    </div>
  );
};

export default SelectedQuestionsCard;