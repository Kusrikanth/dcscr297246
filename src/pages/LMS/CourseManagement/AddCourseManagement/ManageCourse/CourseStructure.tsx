import React, { useRef, useState } from "react";
import {
    ArrayHelpers,
    FieldArray,
    FormikProvider,
    useFormik,
} from "formik";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Delete02StrokeStandard,
    DragDropVerticalIcon,
    Edit01StrokeStandard,
} from "@hugeicons-pro/core-stroke-standard";
import UncontrolledAccordionCard from "../../../../../Components/Common/UncontrolledAccordionCard";
import AccordionCardItem from "../../../../../Components/Common/AccordionCardItem";
import AccordionCardHeader from "../../../../../Components/Common/AccordionCardHeader";
import AccordionCardBody from "../../../../../Components/Common/AccordionCardBody";
import AddContentModal from "./AddContentModal";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import ImportChapter from "./ImportChapter";

const initialValues: CourseStructureFormValues = {
    optionsRow: [],
};
type Lesson = {
    id: number;
    type: "video" | "article";
    title: string;
    duration: string;
};
// ✅ Place this at the top
type ContentType = "Video" | "Blocks" | "Text" | "Assignment" | "Quiz" | "Document";

type OptionRowItem = {
    id: number;
    lessons: Lesson[];
};

type CourseStructureFormValues = {
    optionsRow: OptionRowItem[];
};

const CourseStructure = ({ selectedUnitIndex }) => {

    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const {
        openModal: addOpenCourseModal,
        closeModal: addCloseCourseModal,
        modalState: addCourseModalState,
    } = useModal();
    const {
        openModal: openImportChapterModal,
        closeModal: closeImportChapterModal,
        modalState: importChapterState,
    } = useModal();

    const courseStructureForm = useFormik<CourseStructureFormValues>({
        enableReinitialize: true,
        initialValues,
        onSubmit: () => { },
    });

    const addSlabHandler = () => {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                id: generateUniqueNumber(),
                lessons: [], // ✅ Initialize lessons array
            });
        }
    };

    function removeSlabHndlr(event: React.MouseEvent<SVGSVGElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }
    const addLessonHandler = (chapterIndex: number) => {
        const chapter = courseStructureForm.values.optionsRow[chapterIndex];
        const updatedLessons = [
            ...(chapter.lessons || []),
            {
                id: Number(generateUniqueNumber()),
                type: "video",
                title: `Topic`,
                duration: "12 min",
            } as Lesson,
        ];

        const updatedOptionsRow = [...courseStructureForm.values.optionsRow];
        updatedOptionsRow[chapterIndex] = {
            ...chapter,
            lessons: updatedLessons,
        };

        courseStructureForm.setFieldValue("optionsRow", updatedOptionsRow);
    };
    const removeLessonHandler = (chapterIndex: number, lessonIndex: number) => {
        const chapter = courseStructureForm.values.optionsRow[chapterIndex];
        const updatedLessons = [...(chapter.lessons || [])];
        updatedLessons.splice(lessonIndex, 1);

        const updatedOptionsRow = [...courseStructureForm.values.optionsRow];
        updatedOptionsRow[chapterIndex] = {
            ...chapter,
            lessons: updatedLessons,
        };

        courseStructureForm.setFieldValue("optionsRow", updatedOptionsRow);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = courseStructureForm.values.optionsRow.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = courseStructureForm.values.optionsRow.findIndex(
                (item) => item.id === over.id
            );
            const newOptionsRow = arrayMove(
                courseStructureForm.values.optionsRow,
                oldIndex,
                newIndex
            );
            courseStructureForm.setFieldValue("optionsRow", newOptionsRow);
        }
    };
    const handleLessonDragEnd = (event: DragEndEvent, chapterIndex: number) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const chapter = courseStructureForm.values.optionsRow[chapterIndex];
        const oldIndex = chapter.lessons.findIndex((lesson) => lesson.id === active.id);
        const newIndex = chapter.lessons.findIndex((lesson) => lesson.id === over.id);
        const newLessons = arrayMove(chapter.lessons, oldIndex, newIndex);

        const updatedOptionsRow = [...courseStructureForm.values.optionsRow];
        updatedOptionsRow[chapterIndex] = {
            ...chapter,
            lessons: newLessons,
        };

        courseStructureForm.setFieldValue("optionsRow", updatedOptionsRow);
    };

    return (
        <>
            <div className="">
                <div className="card-header pb-0">
                    <div className="row mb-2">
                        <div className='col-4 d-flex align-items-center'>
                            <h4 className="card-title fs-14">
                                Map Lesson Content
                            </h4>
                        </div>
                        <div className='col-auto ms-auto d-flex'>

                            <button onClick={(e) => openImportChapterModal()} className="btn btn-outline-info fs-13 d-flex align-items-center me-3">
                                <i className="ri-add-line me-2" />  Import Chapter
                            </button>
                            <button
                                onClick={addSlabHandler}
                                className={`btn btn-success fs-13 d-flex align-items-center ${courseStructureForm.values.optionsRow.length === 0 ? "d-none" : ""
                                    }`}
                            >
                                <i className="ri-add-line me-2" /> Add Chapter
                            </button>

                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">

                </div>
                <div className="mb-4">

                    <FormikProvider value={courseStructureForm}>
                        <FieldArray name="optionsRow">
                            {(arrayHelpers: ArrayHelpers) => {
                                formikArrayHelpers.current = arrayHelpers;

                                return courseStructureForm.values.optionsRow.length === 0 ? (
                                    <div className="text-center my-4">
                                        <p className="text-muted">No chapters added.</p>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() =>
                                                arrayHelpers.push({
                                                    id: generateUniqueNumber(),
                                                    lessons: [],
                                                })
                                            }
                                        >
                                            <i className="ri-add-line me-2" /> Add Chapter
                                        </button>
                                    </div>
                                ) : (
                                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext
                                            items={courseStructureForm.values.optionsRow.map((item) => item.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {courseStructureForm.values.optionsRow.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id}>
                                                    {({ setNodeRef, style, listeners, attributes }) => (
                                                        <div ref={setNodeRef} className="px-3">
                                                            <div
                                                                style={{ ...style, marginBottom: "10px" }}
                                                                className="border rounded"
                                                            >
                                                                <UncontrolledAccordionCard defaultOpen={[`chapter-${item.id}`]}>
                                                                    <AccordionCardItem>
                                                                        <AccordionCardHeader
                                                                            targetId={`chapter-${item.id}`}
                                                                            accordionHeaderClass="d-flex align-items-center justify-content-between p-3 pb-2 bg-white "
                                                                            titleClass="d-flex align-items-center flex-grow-1"
                                                                            title={
                                                                                <div className="d-flex align-items-center w-100">
                                                                                    <div
                                                                                        className="me-3 d-flex align-items-center"
                                                                                        {...listeners}
                                                                                        {...attributes}
                                                                                        style={{ cursor: "grab" }}
                                                                                    >
                                                                                        <HugeiconsIcon icon={DragDropVerticalIcon} size={18} />
                                                                                    </div>
                                                                                    <div
                                                                                        className="badge me-3 d-flex justify-content-center align-items-center"
                                                                                        style={{
                                                                                            width: "25px",
                                                                                            height: "25px",
                                                                                            backgroundColor: "#00b5ad",
                                                                                            color: "#fff",
                                                                                            fontSize: "11px",
                                                                                            borderRadius: "15px",
                                                                                        }}
                                                                                    >
                                                                                        {`${selectedUnitIndex + 1}.${index + 1}`}
                                                                                    </div>
                                                                                    <div className="d-flex justify-content-between w-100">
                                                                                        <div className="d-flex flex-column">
                                                                                            <strong className="text-dark">
                                                                                                Thinker Primary Book {index + 1}
                                                                                            </strong>
                                                                                            <span className="text-muted small">
                                                                                                4 Topics • 45 min
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="d-flex justify-content-between align-items-center me-2">
                                                                                            <HugeiconsIcon icon={Edit01StrokeStandard} size={16} style={{ cursor: "pointer" }} className="me-2" />
                                                                                            <HugeiconsIcon icon={Delete02StrokeStandard} size={16} style={{ cursor: "pointer", zIndex: "10000" }} onClick={removeSlabHndlr} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                        />
                                                                        <AccordionCardBody
                                                                            accordionId={`chapter-${item.id}`}
                                                                            style={{ paddingBottom: "1px" }}
                                                                        >
                                                                            <div className="w-100 pb-3 px-4 pt-0">
                                                                                <DndContext
                                                                                    collisionDetection={closestCenter}
                                                                                    onDragEnd={(event) => handleLessonDragEnd(event, index)}
                                                                                >
                                                                                    <SortableContext
                                                                                        items={(item.lessons || []).map(
                                                                                            (lesson) => lesson.id
                                                                                        )}
                                                                                        strategy={verticalListSortingStrategy}
                                                                                    >
                                                                                        {(item.lessons || []).map((lesson, lessonIndex) => (
                                                                                            <SortableItem key={lesson.id} id={lesson.id}>
                                                                                                {({
                                                                                                    setNodeRef,
                                                                                                    style: lessonStyle,
                                                                                                    listeners: lessonListeners,
                                                                                                    attributes: lessonAttributes,
                                                                                                }) => (
                                                                                                    <div
                                                                                                        ref={setNodeRef}
                                                                                                        style={{
                                                                                                            ...lessonStyle,
                                                                                                            marginBottom: "10px",
                                                                                                        }}
                                                                                                        className="d-flex rounded"
                                                                                                    >
                                                                                                        <div
                                                                                                            className="d-flex align-items-center w-100 p-2 rounded"
                                                                                                            style={{
                                                                                                                backgroundColor: "#f9fafb",
                                                                                                                border: "1px solid #e5e7eb",
                                                                                                                boxShadow:
                                                                                                                    "0 1px 2px rgba(0, 0, 0, 0.05)",
                                                                                                            }}
                                                                                                        >
                                                                                                            <div
                                                                                                                className="me-3 d-flex align-items-center"
                                                                                                                {...lessonListeners}
                                                                                                                {...lessonAttributes}
                                                                                                                style={{ cursor: "grab" }}
                                                                                                            >
                                                                                                                <HugeiconsIcon
                                                                                                                    icon={DragDropVerticalIcon}
                                                                                                                    size={18}
                                                                                                                />
                                                                                                            </div>
                                                                                                            <div className="d-flex justify-content-between w-100">
                                                                                                                <div className="d-flex align-items-center gap-3">
                                                                                                                    <div
                                                                                                                        style={{
                                                                                                                            backgroundColor: "#3b82f6",
                                                                                                                            borderRadius: "6px",
                                                                                                                            width: "22px",
                                                                                                                            height: "22px",
                                                                                                                            display: "flex",
                                                                                                                            alignItems: "center",
                                                                                                                            justifyContent: "center",
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        <svg
                                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                                            height="15"
                                                                                                                            viewBox="0 0 24 24"
                                                                                                                            width="15"
                                                                                                                            fill="#ffffff"
                                                                                                                        >
                                                                                                                            <path d="M8 5v14l11-7z" />
                                                                                                                        </svg>
                                                                                                                    </div>
                                                                                                                    <div className="d-flex flex-column">
                                                                                                                        <div className="d-flex">
                                                                                                                            <strong className="text-dark fs-10 badge bg-secondary text-white me-2 px-2 py-1 rounded-pill">
                                                                                                                                {`${selectedUnitIndex + 1}.${index + 1
                                                                                                                                    }.${lessonIndex + 1}`}
                                                                                                                            </strong>
                                                                                                                            <strong className="text-dark fs-12">
                                                                                                                                {lesson.title}
                                                                                                                            </strong>
                                                                                                                        </div>
                                                                                                                        <span className="text-muted small fs-12">
                                                                                                                            {lesson.type} • {lesson.duration}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="d-flex align-items-center gap-2">
                                                                                                                    <div className="inline-popup-container">
                                                                                                                        <button
                                                                                                                            className="btn btn-outline-primary py-1 px-2 fs-12"
                                                                                                                            onClick={(e) =>
                                                                                                                                addOpenCourseModal()
                                                                                                                            }
                                                                                                                        >
                                                                                                                            Add Content
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                    <HugeiconsIcon
                                                                                                                        icon={Edit01StrokeStandard}
                                                                                                                        size={16}
                                                                                                                        style={{ cursor: "pointer" }}
                                                                                                                    />
                                                                                                                    <HugeiconsIcon
                                                                                                                        onClick={() =>
                                                                                                                            removeLessonHandler(
                                                                                                                                index,
                                                                                                                                lessonIndex
                                                                                                                            )
                                                                                                                        }
                                                                                                                        icon={Delete02StrokeStandard}
                                                                                                                        size={16}
                                                                                                                        style={{ cursor: "pointer" }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </SortableItem>
                                                                                        ))}
                                                                                    </SortableContext>
                                                                                </DndContext>

                                                                                <button
                                                                                    className="btn btn-outline-primary w-100 mt-2"
                                                                                    style={{
                                                                                        padding: "10px",
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
                                                                                    onClick={() => addLessonHandler(index)}
                                                                                >
                                                                                    <i className="ri-add-line me-2" /> Add Topic
                                                                                </button>
                                                                            </div>
                                                                        </AccordionCardBody>
                                                                    </AccordionCardItem>
                                                                </UncontrolledAccordionCard>
                                                            </div>
                                                        </div>
                                                    )}
                                                </SortableItem>
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>


                </div>
            </div>
            <ModalContainerUpdated
                id="add-course-modal"
                isOpen={addCourseModalState.showModal}
                toggle={addCloseCourseModal}
                modalSize="md"
                modalTitle="Course Configuration"
            >
                <AddContentModal />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="import-chapter"
                isOpen={importChapterState.showModal}
                toggle={closeImportChapterModal}
                modalSize="lg"
                modalTitle="Import Chapter"
            >
                <ImportChapter />
            </ModalContainerUpdated>
        </>
    );
};

export default CourseStructure;
