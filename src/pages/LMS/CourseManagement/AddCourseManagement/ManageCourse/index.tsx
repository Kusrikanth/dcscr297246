import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { useRef, useState } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, MoreHorizontalIcon, PencilEdit02Icon, SettingDone01Icon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { ModalContainerUpdated } from '../../../../../Components/Common';
import { CSS } from '@dnd-kit/utilities';
import AddUnitModel from './AddUnitModel';
import BreadCrumb from '../../../../../Components/Common/BreadCrumb';
import CourseStructure from './CourseStructure';
import ThumbnailColorSelector from '../ThumbnailColorSelector';
import { default as MathsSVG } from "../../../../../assets/imagesdps/lms/maths.svg?react";
import ChartPercentage from './ChartPercentage';

const initialValues = {
    description: "",
    optionsRow: [
        {
            id: generateUniqueNumber(),
            optionText: "",
            optionMarks: ""
        }
    ],
};

export interface Option {
    id: number;
    optionTextId: string;
    text: string;
    selectMultiple?: boolean;
}
export type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'FillInTheBlanks';

export interface Question {
    id: number;
    questionText: string;
    questionType: QuestionType; // <-- Add this
    status: 'Correct' | 'Incorrect';
    chosenOptionId?: number;
    chosenOptionIds?: number[];
    correctOptionId?: number;
    correctOptionIds?: number[];
    correctAnswerText?: string;
    chosenAnswerText?: string;
    solution?: string; // <-- Add this
    options?: Option[];
}

const questions: Question[] = [
    {
        id: 1,
        questionType: 'SingleChoice',
        questionText: 'Solve for x: 2x + 5 = 13',
        status: 'Correct',
        chosenOptionId: 2,
        correctOptionId: 2,
        options: [
            { id: 1, optionTextId: 'a', text: 'x = 3' },
            { id: 2, optionTextId: 'b', text: 'x = 4' },
            { id: 3, optionTextId: 'c', text: 'x = 5' },
            { id: 4, optionTextId: 'd', text: 'x = 6' },
        ],
    },
    {
        id: 2,
        questionType: 'MultipleChoice',
        questionText: 'Which of the following are prime numbers?',
        status: 'Correct',
        chosenOptionIds: [2, 4],
        correctOptionIds: [2, 4],
        options: [
            { id: 1, optionTextId: 'a', text: '4', selectMultiple: false },
            { id: 2, optionTextId: 'b', text: '7', selectMultiple: true },
            { id: 3, optionTextId: 'c', text: '9', selectMultiple: false },
            { id: 4, optionTextId: 'd', text: '11', selectMultiple: true },
        ],

    },
    {
        id: 3,
        questionType: 'FillInTheBlanks',
        questionText: 'The square root of 64 is ________',
        status: 'Correct',
        chosenAnswerText: '8',
        correctAnswerText: '8',
    }
];
const questionData: Question = {
    id: 1,
    questionText: 'What is the HCF of 36 and 60?',
    questionType: 'SingleChoice',
    status: 'Incorrect',
    chosenOptionId: 3,
    correctOptionId: 2,
    solution: 'HCF of 36 and 60 is 12',
    options: [
        { id: 1, optionTextId: 'a', text: '6' },
        { id: 2, optionTextId: 'b', text: '12' },
        { id: 3, optionTextId: 'c', text: '18' },
        { id: 4, optionTextId: 'd', text: '24' },
    ],
};

const ManageCourse = ({ question }) => {
    const [thumbnailColor, setThumbnailColor] = useState("#E2E8F0");
    const [showDropdown, setShowDropdown] = useState(false);
    const {
        openModal: addOpenThumbNailModal,
        closeModal: addCloseThumbNailModal,
        modalState: addThumbNailModalState,
    } = useModal();
    const { closeModal: closeAddUnitModal, modalState: addUnitState, openModal: openAddUnitModal } = useModal();
    const [questionList, setQuestionList] = useState([
        {
            formData: initialValues,
            title: "Unit 1",
        },
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const q: Question = question || questionData;
    const addQuestionForm = useFormik({
        initialValues: {
            solutionDetails: false,
            ...(questionList[currentQuestionIndex].formData),
            chosenOptionId: q.chosenOptionId,
            options: q.options?.map(opt => ({
                selectMultiple: q.chosenOptionIds?.includes(opt.id) ?? false, // ✅ prefill checkbox
                optionText: '',
                optionMarks: '',
            })) ?? []

        },
        enableReinitialize: true,
        onSubmit: () => { },
    });
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
        updateQuestionFromForm();
        setCurrentQuestionIndex(index);
    };
    const extractTextFromTipTapJson = (node: any): string => {
        if (!node) return "";

        if (node.type === "text" && node.text) {
            return node.text;
        }
        if (Array.isArray(node.content)) {
            return node.content.map(extractTextFromTipTapJson).join(" ");
        }
        return "";
    };
    const updateQuestionFromForm = () => {
        const content = addQuestionForm.values.description;
        const plainText = extractTextFromTipTapJson(content);

        const updated = [...questionList];
        updated[currentQuestionIndex] = {
            title: plainText || `Unit ${currentQuestionIndex + 1}`,
            formData: addQuestionForm.values,
        };

        setQuestionList(updated);
    };
    const handleDeleteQuestion = (index: number) => {
        if (questionList.length === 1) {
            alert("At least one Unit is required.");
            return;
        }

        const updatedList = questionList.filter((_, i) => i !== index);
        setQuestionList(updatedList);
        if (currentQuestionIndex === index) {
            setCurrentQuestionIndex(index > 0 ? index - 1 : 0);
        } else if (currentQuestionIndex > index) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    const handleAddQuestion = () => {
        updateQuestionFromForm();
        setQuestionList(prev => {
            const newQuestion = {
                formData: initialValues,
                title: `Unit ${prev.length + 1}`,
            };
            const updatedList = [...prev, newQuestion];
            setTimeout(() => {
                setCurrentQuestionIndex(updatedList.length - 1);
            }, 0);

            return updatedList;
        });
    };
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    const SortableQuestionItem = ({
        id,
        index,
        item,
        currentQuestionIndex,
        onSelect,
        onDelete,
        isDropdownOpen,
        setOpenDropdownIndex,
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
            padding: "10px",
            marginBottom: "8px",
            borderRadius: "5px",
            background: "#fff",
            border: "1px solid #ddd",
            cursor: "pointer",
        };
        const toggleDropdown = (e: React.MouseEvent) => {
            e.stopPropagation();
            setOpenDropdownIndex(prev => (prev === index ? null : index));
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`d-flex align-items-center justify-content-between form-check ${currentQuestionIndex === index ? "bg-light rounded p-2" : ""
                    }`}
                onClick={() => onSelect(index)}
            >
                <div className="d-flex align-items-center">
                    <div className="d-grid align-items-center">
                        <label className="ms-2 fs-12 mb-0">
                            {item.title || `Unit ${index + 1}`}
                        </label>
                        <label className="ms-2 fs-11 text-muted mb-0">
                            5 Chapters
                        </label>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="position-relative d-inline-block">
                        <button className="btn btn-sm border-0 p-1" onClick={toggleDropdown}>
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="py-2 position-absolute start-0 mt-2 bg-white border rounded shadow"
                                style={{ minWidth: "100px", zIndex: "1000" }}
                            >
                                <button
                                    className="btn btn-sm btn-outline-light border-0 w-100 text-start text-dark d-flex align-items-center"
                                    onClick={() => {
                                        setOpenDropdownIndex(null);
                                        openAddUnitModal();
                                    }}
                                >
                                    <HugeiconsIcon icon={PencilEdit02Icon} className="me-1" size={13} />
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-light border-0 w-100 text-start text-dark d-flex align-items-center"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownIndex(null);
                                        onDelete(index);
                                    }}
                                >
                                    <HugeiconsIcon icon={Delete02StrokeStandard} className="me-1" size={13} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        );
    };
    const dummyClassSubjectList = [
        { cardName: "John Smith", shortName: "JS", color: "rgb(228, 169, 10)", bookColor: "rgb(255, 243, 211)" },
        { cardName: "Alice Johnson", shortName: "AJ", color: "rgb(253, 227, 222)", bookColor: "rgb(190, 29, 92)" },
        { cardName: "Raj Kumar", shortName: "RK", color: "rgb(216, 237, 249)", bookColor: "rgb(0, 126, 230)" }
    ]
    return (
        <>
            <div className="page-content lms_faq academic_section_details_wrapper">
                <div className="container-fluid LMS course">
                    <BreadCrumb title="LMS" pageTitle="LMS" />
                    <div className="course">
                        <div className="card mb-2 rounded shadow-lg bg-gradient bg-gradient-blue-violet">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between px-2 mb-2">
                                    <div className="d-flex w-25">
                                        <div className="flex-shrink-0 bg-light p-1 me-3 bg-gradient rounded shadow-lg d-flex justify-content-center align-items-center">
                                            <MathsSVG width={"50px"} height={"50px"} style={{ padding: "5px" }} />
                                        </div>
                                        <div className="d-flex flex-column">
                                            <h5 className="mb-2 fs-14 d-flex text-nowrap">
                                                10 - CBSE- Grade 1A  Maths - &nbsp;<div
                                                    className="text-dark fs-11 badge bg-secondary text-white fw-medium me-2 px-2 py-1 rounded-pill"
                                                >
                                                    CB0010X
                                                </div>
                                            </h5>
                                            <div className="d-flex align-items-center">
                                                <h6 className='me-2'>
                                                    <span className="text-primary fs-13 d-flex align-items-center">
                                                        {
                                                            Array.isArray(dummyClassSubjectList) && dummyClassSubjectList.length > 1 && <div className="avatar-group">
                                                                {dummyClassSubjectList.map((sub: any, index: number) => <div className="avatar-group-item p-2" data-bs-toggle="tooltip" data-bs-placement="top" title={sub.cardName} key={index} style={{ backgroundColor: `${sub.color}`, color: `${sub.bookColor}` }}>
                                                                    {sub.shortName}
                                                                </div>
                                                                )
                                                                }&nbsp;</div>
                                                        }
                                                    </span>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-grid'>
                                        <div className='d-flex justify-content-end me-4'>
                                            <HugeiconsIcon icon={SettingDone01Icon} size={16} />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <ChartPercentage seriesData={75} /><h6 className="me-3 mb-0 g-2 fs-13"><span>Completed<br /><span className='text-muted mt-2 fw-medium'>Overall</span></span></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <div className='row'>
                                <div className='col-md-4 col-12'>
                                    <div className="card shadow-lg">
                                        <div className="card-header pb-0">
                                            <div className="row mb-2">
                                                <div className='col-8 d-grid align-items-center'>
                                                    <h4 className="card-title fs-14 mb-3">
                                                        Unit List
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div>
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
                                                                isDropdownOpen={openDropdownIndex === index}
                                                                setOpenDropdownIndex={setOpenDropdownIndex}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                                <button className="btn btn-outline-primary fs-12 px-5 w-100 mt-3" onClick={handleAddQuestion}>
                                                    <i className="ri-add-line me-2 pt-2" />   Add Unit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-8 col-12'>
                                    <div className="card shadow-lg">
                                        <CourseStructure selectedUnitIndex={currentQuestionIndex} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={addUnitState.showModal}
                toggle={() => closeAddUnitModal()}
                modalTitle="Add Unit"
                modalSize="md"
            >
                <AddUnitModel
                    key={currentQuestionIndex}
                    unitName={questionList[currentQuestionIndex]?.title || ""}
                    toggle={closeAddUnitModal}
                    onSubmit={(unitName: string) => {
                        const updated = [...questionList];
                        updated[currentQuestionIndex] = {
                            ...updated[currentQuestionIndex],
                            title: unitName || `Unit ${currentQuestionIndex + 1}`,
                        };
                        setQuestionList(updated);
                        closeAddUnitModal();
                    }}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="thumbanail-modal"
                isOpen={addThumbNailModalState.showModal}
                toggle={addCloseThumbNailModal}
                modalTitle="Thumbnail"
                modalSize="md"
            >
                <ThumbnailColorSelector selectedColor={thumbnailColor} onSelectColor={setThumbnailColor} />
            </ModalContainerUpdated>
        </>
    );
};

export default ManageCourse;
