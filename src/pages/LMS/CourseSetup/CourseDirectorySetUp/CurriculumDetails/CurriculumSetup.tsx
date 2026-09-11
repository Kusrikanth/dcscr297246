import React, { useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
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
import SortableItem from "../../../../../Components/Common/SortableItem";
import {
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewChapterModal from "./AddEditNewChapterModal";

// Types
type Topic = {
  id: number;
  topicName: string;
  sessions: number;
  week: number;
};

type Chapter = {
  id: number;
  chapterName: string;
  topics: Topic[];
};

type FormValues = {
  chapters: Chapter[];
};

// Initial values
const initialValues: any = {
  chapters: [
    {
      id: generateUniqueNumber(),
      chapterName: "",
      topics: [
        {
          id: generateUniqueNumber(),
          topicName: "",
          sessions: 1,
          week: 1,
        },
      ],
    },
  ],
};

// Validation schema
const validationSchema = Yup.object().shape({
  chapters: Yup.array()
    .of(
      Yup.object().shape({
        chapterName: Yup.string().required("Chapter name is required"),
        topics: Yup.array().of(
          Yup.object().shape({
            topicName: Yup.string().required("Topic name is required"),
            sessions: Yup.number()
              .typeError("Sessions must be a number")
              .required("Sessions are required")
              .positive("Must be greater than 0"),
            week: Yup.number()
              .typeError("Week must be a number")
              .required("Week is required")
              .min(1, "Week must be at least 1")
              .max(40, "Week can't exceed 40"),
          })
        ),
      })
    )
    .required("At least one chapter is required"),
});

const CurriculumSetup = ({ selectedUnit }) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const {
    openModal: addEditNewOpenChapter,
    closeModal: addEditNewCloseChapter,
    modalState: addEditNewChapterModalState,
  } = useModal();

  const formik = useFormik<any>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  // Chapter handlers
  const addChapterHandler = () => {
    formik.setFieldValue("chapters", [
      ...formik.values.chapters,
      {
        id: generateUniqueNumber(),
        chapterName: "",
        topics: [
          {
            id: generateUniqueNumber(),
            topicName: "",
            sessions: 1,
            week: 1,
          },
        ],
      },
    ]);
  };

  const removeChapterHandler = (chapterIndex: number) => {
    const chapters = [...formik.values.chapters];
    chapters.splice(chapterIndex, 1);
    formik.setFieldValue("chapters", chapters);
  };

  // Topic handlers
  const addTopicHandler = (chapterIndex: number) => {
    const chapters = [...formik.values.chapters];
    chapters[chapterIndex].topics.push({
      id: generateUniqueNumber(),
      topicName: "",
      sessions: 1,
      week: 1,
    });
    formik.setFieldValue("chapters", chapters);
  };

  const removeTopicHandler = (chapterIndex: number, topicIndex: number) => {
    const chapters = [...formik.values.chapters];
    chapters[chapterIndex].topics.splice(topicIndex, 1);
    formik.setFieldValue("chapters", chapters);
  };

  // Drag and drop handlers
  const handleChapterDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formik.values.chapters.findIndex(
      (chapter) => chapter.id === active.id
    );
    const newIndex = formik.values.chapters.findIndex(
      (chapter) => chapter.id === over.id
    );

    const newChapters = arrayMove(formik.values.chapters, oldIndex, newIndex);
    formik.setFieldValue("chapters", newChapters);
  };

  const handleTopicDragEnd = (event: DragEndEvent, chapterIndex: number) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const chapter = formik.values.chapters[chapterIndex];
    const oldIndex = chapter.topics.findIndex(
      (topic) => topic.id === active.id
    );
    const newIndex = chapter.topics.findIndex((topic) => topic.id === over.id);

    const newTopics = arrayMove(chapter.topics, oldIndex, newIndex);
    const chapters = [...formik.values.chapters];
    chapters[chapterIndex].topics = newTopics;
    formik.setFieldValue("chapters", chapters);
  };

  return (
    <>
      <div className="card !tw-rounded-lg border tw-overflow-hidden">
        <div className="card-header pb-0">
          <div className="row mb-2">
            <div className="col-4 d-flex align-items-center">
              <h4 className="card-title fs-14">Course Structure</h4>
            </div>
            <div className="col-auto ms-auto d-flex">
              <button
                onClick={addEditNewOpenChapter}
                className="btn btn-success fs-13 d-flex align-items-center"
              >
                <i className="ri-add-line me-2" /> Add Chapter
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <FormikProvider value={formik}>
            <FieldArray name="chapters">
              {(arrayHelpers: ArrayHelpers) => {
                formikArrayHelpers.current = arrayHelpers;

                return formik.values.chapters.length === 0 ? (
                  <div className="text-center my-4">
                    <p className="text-muted">No chapters added.</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addChapterHandler}
                    >
                      <i className="ri-add-line me-2" /> Add Chapter
                    </button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleChapterDragEnd}
                  >
                    <SortableContext
                      items={formik.values.chapters.map(
                        (chapter) => chapter.id
                      )}
                      strategy={verticalListSortingStrategy}
                    >
                      {formik.values.chapters.map((chapter, chapterIndex) => {
                        return (
                          <SortableItem key={chapter.id} id={chapter.id}>
                            {({ setNodeRef, style, listeners, attributes }) => (
                              <div ref={setNodeRef} className="px-3 mb-3">
                                <div
                                  style={{ ...style }}
                                  className="border rounded"
                                >
                                  <UncontrolledAccordionCard
                                    defaultOpen={[`chapter-${chapter.id}`]}
                                  >
                                    <AccordionCardItem className="mb-0">
                                      <AccordionCardHeader
                                        targetId={`chapter-${chapter.id}`}
                                        accordionHeaderClass="d-flex align-items-center justify-content-between p-0 bg-light"
                                        titleClass="d-flex align-items-center flex-grow-1"
                                        title={
                                          <div className="d-flex align-items-center w-100 me-2">
                                            <div
                                              className="me-3 d-flex align-items-center"
                                              {...listeners}
                                              {...attributes}
                                              style={{ cursor: "grab" }}
                                            >
                                              <HugeiconsIcon
                                                icon={DragDropVerticalIcon}
                                                size={18}
                                                className="text-muted"
                                              />
                                            </div>
                                            <div
                                              className="badge me-3 d-flex justify-content-center align-items-center"
                                              style={{
                                                width: "25px",
                                                height: "25px",
                                                backgroundColor: "#3b82f6",
                                                color: "#fff",
                                                fontSize: "11px",
                                                borderRadius: "15px",
                                              }}
                                            >
                                              {`${selectedUnit?.id}.${
                                                chapterIndex + 1
                                              }`}
                                            </div>
                                            <div className="d-flex justify-content-between w-100">
                                              <div className="d-flex flex-column flex-grow-1 me-3">
                                                Chapter
                                              </div>
                                              <div className="d-flex justify-content-between align-items-center">
                                                <HugeiconsIcon
                                                  icon={Edit01StrokeStandard}
                                                  size={20}
                                                  className="tw-cursor-pointer tw-me-2  tw-z-10"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    addEditNewOpenChapter();
                                                  }}
                                                />
                                                <HugeiconsIcon
                                                  icon={Delete02StrokeStandard}
                                                  size={18}
                                                  className="text-danger"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() =>
                                                    removeChapterHandler(
                                                      chapterIndex
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      />
                                      <AccordionCardBody
                                        accordionId={`chapter-${chapter.id}`}
                                        style={{ paddingBottom: "1px" }}
                                      >
                                        <div className="w-100 pb-3 px-0 pt-0">
                                          <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(event) =>
                                              handleTopicDragEnd(
                                                event,
                                                chapterIndex
                                              )
                                            }
                                          >
                                            <SortableContext
                                              items={chapter.topics.map(
                                                (topic) => topic.id
                                              )}
                                              strategy={
                                                verticalListSortingStrategy
                                              }
                                            >
                                              {chapter.topics.map(
                                                (topic, topicIndex) => (
                                                  <SortableItem
                                                    key={topic.id}
                                                    id={topic.id}
                                                  >
                                                    {({
                                                      setNodeRef:
                                                        setTopicNodeRef,
                                                      style: topicStyle,
                                                      listeners: topicListeners,
                                                      attributes:
                                                        topicAttributes,
                                                    }) => (
                                                      <div
                                                        ref={setTopicNodeRef}
                                                        style={{
                                                          ...topicStyle,
                                                          marginBottom: "10px",
                                                        }}
                                                        className="border rounded"
                                                      >
                                                        <UncontrolledAccordionCard
                                                          defaultOpen={[
                                                            `topic-${topic.id}`,
                                                          ]}
                                                        >
                                                          <AccordionCardItem className="mb-0">
                                                            <AccordionCardHeader
                                                              targetId={`topic-${topic.id}`}
                                                              accordionHeaderClass="d-flex align-items-center justify-content-between p-0 bg-light"
                                                              titleClass="d-flex align-items-center flex-grow-1"
                                                              title={
                                                                <div className="d-flex align-items-center w-100 me-2">
                                                                  <div
                                                                    className="me-3 d-flex align-items-center"
                                                                    {...topicListeners}
                                                                    {...topicAttributes}
                                                                    style={{
                                                                      cursor:
                                                                        "grab",
                                                                    }}
                                                                  >
                                                                    <HugeiconsIcon
                                                                      icon={
                                                                        DragDropVerticalIcon
                                                                      }
                                                                      size={18}
                                                                    />
                                                                  </div>
                                                                  <div
                                                                    className="badge me-3 d-flex justify-content-center align-items-center"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#3b82f6",
                                                                      color:
                                                                        "#fff",
                                                                      fontSize:
                                                                        "11px",
                                                                      borderRadius:
                                                                        "15px",
                                                                    }}
                                                                  >
                                                                    {`${
                                                                      selectedUnit?.id
                                                                    }.${
                                                                      chapterIndex +
                                                                      1
                                                                    }.${
                                                                      topicIndex +
                                                                      1
                                                                    }`}
                                                                  </div>
                                                                  <div className="d-flex justify-content-between w-100">
                                                                    <p className="tw-mb-0 tw-text-sm tw-font-medium">
                                                                      Topic
                                                                    </p>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                      <HugeiconsIcon
                                                                        icon={
                                                                          Delete02StrokeStandard
                                                                        }
                                                                        size={
                                                                          16
                                                                        }
                                                                        style={{
                                                                          cursor:
                                                                            "pointer",
                                                                        }}
                                                                        className="text-danger"
                                                                        onClick={() =>
                                                                          removeTopicHandler(
                                                                            chapterIndex,
                                                                            topicIndex
                                                                          )
                                                                        }
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              }
                                                            />
                                                            <AccordionCardBody
                                                              accordionId={`topic-${topic.id}`}
                                                            >
                                                              <div className="w-100 pb-3 px-0 pt-0">
                                                                {(() => {
                                                                  // Extract error and touched for current topic
                                                                  const topicError =
                                                                    formik
                                                                      .errors
                                                                      .chapters?.[
                                                                      chapterIndex
                                                                    ]?.topics?.[
                                                                      topicIndex
                                                                    ] || {};
                                                                  const topicTouched =
                                                                    formik
                                                                      .touched
                                                                      .chapters?.[
                                                                      chapterIndex
                                                                    ]?.topics?.[
                                                                      topicIndex
                                                                    ] || {};

                                                                  return (
                                                                    <div className="row">
                                                                      {/* Topic Name */}
                                                                      <div className="col-12">
                                                                        <TextInput
                                                                          name={`chapters.${chapterIndex}.topics.${topicIndex}.topicName`}
                                                                          value={
                                                                            topic.topicName
                                                                          }
                                                                          onChange={
                                                                            formik.handleChange
                                                                          }
                                                                          labelText="Topic Name"
                                                                          placeHolder="Enter Topic Name"
                                                                          inputClassName="input"
                                                                          invalid={
                                                                            !!topicTouched?.topicName &&
                                                                            !!topicError?.topicName
                                                                          }
                                                                          error={
                                                                            topicTouched?.topicName &&
                                                                            topicError?.topicName
                                                                              ? (topicError.topicName as string)
                                                                              : ""
                                                                          }
                                                                          formgroupClassName="mb-2"
                                                                        />
                                                                      </div>

                                                                      {/* Sessions */}
                                                                      <div className="col-6">
                                                                        <SelectInput
                                                                          name={`chapters.${chapterIndex}.topics.${topicIndex}.weeks`}
                                                                          value={
                                                                            "1"
                                                                          }
                                                                          onChange={
                                                                            formik.handleChange
                                                                          }
                                                                          valueKey="sessionId"
                                                                          textKey="sessionName"
                                                                          menuItems={[]}
                                                                          invalid={
                                                                            topicError?.week &&
                                                                            topicTouched?.week
                                                                              ? true
                                                                              : false
                                                                          }
                                                                          error={
                                                                            topicError?.week &&
                                                                            topicTouched?.week
                                                                              ? topicError?.week
                                                                              : ""
                                                                          }
                                                                          labelText="Weeks"
                                                                          formgroupClassName="mb-2"
                                                                          //   floatingLabel
                                                                        />
                                                                      </div>

                                                                      {/* Week */}
                                                                      <div className="col-6">
                                                                        <SelectInput
                                                                          name={`chapters.${chapterIndex}.topics.${topicIndex}.sessions`}
                                                                          value={
                                                                            "1"
                                                                          }
                                                                          onChange={
                                                                            formik.handleChange
                                                                          }
                                                                          valueKey="sessionId"
                                                                          textKey="sessionName"
                                                                          menuItems={[]}
                                                                          invalid={
                                                                            topicError?.week &&
                                                                            topicTouched?.week
                                                                              ? true
                                                                              : false
                                                                          }
                                                                          error={
                                                                            topicError?.week &&
                                                                            topicTouched?.week
                                                                              ? topicError?.week
                                                                              : ""
                                                                          }
                                                                          labelText="Planned Sessions"
                                                                          formgroupClassName="mb-2"
                                                                          //   floatingLabel
                                                                        />
                                                                      </div>
                                                                      <div className="col-6">
                                                                        <SelectInput
                                                                          name={`chapters.${chapterIndex}.topics.${topicIndex}.blooms`}
                                                                          menuItems={[]}
                                                                          value={
                                                                            ""
                                                                          }
                                                                          valueKey=""
                                                                          textKey=""
                                                                          onChange={
                                                                            formik.handleChange
                                                                          }
                                                                          labelText="Bloom Level"
                                                                          invalid={
                                                                            topicError?.sessions &&
                                                                            topicTouched?.sessions
                                                                              ? true
                                                                              : false
                                                                          }
                                                                          error={
                                                                            topicError?.sessions &&
                                                                            topicTouched?.sessions
                                                                              ? topicError?.sessions
                                                                              : ""
                                                                          }
                                                                          formgroupClassName="mb-2"
                                                                        />
                                                                      </div>
                                                                      <div className="col-6">
                                                                        <TextInput
                                                                          name="los"
                                                                          value=""
                                                                          labelText="LO's"
                                                                          inputClassName=""
                                                                          placeHolder="Enter LO to the current topic"
                                                                          formgroupClassName="mb-2"
                                                                        ></TextInput>
                                                                      </div>
                                                                    </div>
                                                                  );
                                                                })()}
                                                              </div>
                                                            </AccordionCardBody>
                                                          </AccordionCardItem>
                                                        </UncontrolledAccordionCard>
                                                      </div>
                                                    )}
                                                  </SortableItem>
                                                )
                                              )}
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
                                              transition:
                                                "background-color 0.2s ease",
                                            }}
                                            onClick={() =>
                                              addTopicHandler(chapterIndex)
                                            }
                                          >
                                            <i className="ri-add-line me-2" />{" "}
                                            Add Topic
                                          </button>
                                        </div>
                                      </AccordionCardBody>
                                    </AccordionCardItem>
                                  </UncontrolledAccordionCard>
                                </div>
                              </div>
                            )}
                          </SortableItem>
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-new-chpater"
        isOpen={addEditNewChapterModalState.showModal}
        toggle={addEditNewCloseChapter}
        modalSize="md"
        modalTitle="Add New Chapter"
      >
        <AddEditNewChapterModal toggle={addEditNewCloseChapter} />
      </ModalContainerUpdated>
    </>
  );
};

export default CurriculumSetup;
