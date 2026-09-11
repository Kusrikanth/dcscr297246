import React, { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, DragDropVerticalIcon, ListViewIcon, PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import CreateQuestionBank from '../../../../QuestionPool/QuestionBank/QuestionBankUpload/AddQuestion/CreateQuestionBank';
import UncontrolledAccordionCard from '../../../../../../Components/Common/UncontrolledAccordionCard';
import AccordionCardItem from '../../../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../../../Components/Common/AccordionCardBody';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "multiple-choice":
        case "advance-settings":
        case "grades-distribution":
        case "notifcations":
        case "rules":
        case "result-settings":
            return CreateQuestionBank;
        default:
            return null;
    }
}

const AddNewQuestionModal = (props: any) => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>("multiple-choice");
    const [showQuestions, setShowQuestions] = useState(false); // <-- control visibility
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false); // <-- control visibility

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeMenuId);
        return TabComponent ? <TabComponent /> : null;
    }, [activeMenuId]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionList, setQuestionList] = useState([
        { title: "What is 7 + 5?" },
        { title: "What is the square root of 64?" },
        { title: "Solve: 15 - 6 × 2" },
        { title: "What is 25% of 200?" },
        { title: "If x = 4, what is the value of 2x + 3?" },
    ]);


  const SortableQuestionItem = ({
  id,
  index,
  item,
  currentQuestionIndex,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`d-flex align-items-center justify-content-between rounded px-3 py-2 mb-2 ${
        currentQuestionIndex === index ? "bg-light rounded shadow-lg border-0" : "border"
      }`}
      onClick={() => onSelect(index)}
    >
      <div className="d-flex align-items-center gap-2 flex-grow-1">
        <span
          {...attributes}
          {...listeners}
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "grab",
          }}
          className="d-flex bg-success text-white align-items-center justify-content-center flex-shrink-0 fs-12"
        >
          {index + 1}
        </span>
        <span className="text-dark fs-12">{item?.title ?? "No title"}</span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="btn btn-sm btn-light border-0 p-1"
      >
        <HugeiconsIcon icon={Delete02StrokeStandard} size={13} />
      </button>
    </div>
  );
};

    const handleQuestionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = active.id as number;
        const newIndex = over.id as number;
        const reordered = arrayMove(questionList, oldIndex, newIndex);
        setQuestionList(reordered); 

        if (currentQuestionIndex === oldIndex) {
            setCurrentQuestionIndex(newIndex);
        } else if (
            currentQuestionIndex > oldIndex &&
            currentQuestionIndex <= newIndex
        ) {
            setCurrentQuestionIndex((prev) => prev - 1);
        } else if (
            currentQuestionIndex < oldIndex &&
            currentQuestionIndex >= newIndex
        ) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };
    const handleSelectQuestion = (index: number) => {

        setCurrentQuestionIndex(index);
    };
    const handleDeleteQuestion = (index: number) => {
        if (questionList.length === 1) {
            alert("At least one Topic is required.");
            return;
        }

        const updatedList = questionList.filter((_, i) => i !== index);
        setQuestionList(updatedList);

        if (currentQuestionIndex === index) {
            setCurrentQuestionIndex(index > 0 ? index - 1 : 0);
        } else if (currentQuestionIndex > index) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    return (
        <>
            <div className='row pe-3 pt-3 lms_faq'>
                <div className='col-md-3 col-12 pe-0'>
                    <div className="lms_setup_wrapper master-setup-wrapper">
                        <div className='card-body assessment'>
                            <div
                                style={{
                                    position: "relative",
                                    display: "inline-block",
                                    width: "100%",
                                    paddingBottom: "12px",
                                    paddingTop: "20px",
                                    paddingLeft: "20px",
                                    paddingRight: "20px",
                                    border: "1px solid #CED4DA",
                                    borderRadius: "6px",
                                    marginBottom: "20px",
                                }}
                            >
                                <p
                                    className='fs-12'
                                    style={{
                                        position: "absolute",
                                        top: "-11px",
                                        padding: "0px 10px",
                                        color: "#495057",
                                        backgroundColor: "white",
                                    }}
                                >
                                    <HugeiconsIcon icon={ListViewIcon} size={13} /> Question List
                                </p>

                                {showQuestionsPreview ? (
                                    <>
                                        <DndContext
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleQuestionDragEnd}
                                        >
                                            <SortableContext
                                                items={questionList.map((_, index) => index)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {questionList.map((q, index) => (
                                                    <SortableQuestionItem
                                                        key={index}
                                                        id={index}
                                                        index={index}
                                                        item={q}
                                                        currentQuestionIndex={currentQuestionIndex}
                                                        onSelect={handleSelectQuestion}
                                                        onDelete={handleDeleteQuestion}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </DndContext>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-muted fs-12">
                                        Add Question & Save as Draft for Preview
                                    </div>
                                )}

                                <button
                                    className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center fs-12"
                                    style={{
                                        border: "2px dashed #d1d5db",
                                        borderRadius: "8px",
                                        backgroundColor: "white",
                                        color: "#6b7280",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "background-color 0.2s ease",
                                    }}
                                    onClick={() => setShowQuestions(true)}
                                >
                                    <i className="ri-add-line me-2" /> Add Question
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-md-9 col-12 ps-0'>
                    {showQuestions ? activeComponent : (
                        <div className="text-center text-muted py-5">
                            No questions added
                        </div>
                    )}
                </div>
            </div>

            <div className="hstack gap-2 justify-content-center mb-4">
                <button type="button" className="btn btn-light px-5">
                    Cancel
                </button>
                <button className="btn btn-outline-primary px-5" onClick={() => setShowQuestionsPreview(true)}>
                    Save as Draft
                </button>
                <button className="btn btn-success px-5">
                    Submit
                </button>
            </div>
        </>
    );
};

export default AddNewQuestionModal;
