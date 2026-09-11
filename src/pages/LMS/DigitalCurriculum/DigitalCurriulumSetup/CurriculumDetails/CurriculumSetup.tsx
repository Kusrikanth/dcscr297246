import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "../../../../../Components/Common/SortableItem";
import UncontrolledAccordionCard from "../../../../../Components/Common/UncontrolledAccordionCard";
import AccordionCardItem from "../../../../../Components/Common/AccordionCardItem";
import AccordionCardHeader from "../../../../../Components/Common/AccordionCardHeader";
import AccordionCardBody from "../../../../../Components/Common/AccordionCardBody";
import { TextInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropVerticalIcon, Edit01StrokeStandard, Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../../utility/commonutility";

const CurriculumSetup = ({ selectedUnit, unitsList, onUpdateChapters }: any) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const selectedUnitIdx = unitsList?.findIndex((u) => u.id === selectedUnit?.id) + 1;

const initialValues = useMemo(() => {
  return {
    chapters:
      selectedUnit?.chapters?.map((ch) => ({
        id: ch.chapterId ?? generateUniqueNumber(),
        chapterName: ch.chapterName,
        topics: ch.topics.map((t) => ({
          id: t.topicId ?? generateUniqueNumber(),
          topicName: t.topicName,
          sessions: 1,
          week: 1,
          loDetails: [],
        })),
      })) || [],
  };
}, [selectedUnit]);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => { },
  });

  // useEffect(() => {
  //   formik.resetForm({ values: initialValues });
  // }, [selectedUnit?.id]);

  const prevChaptersRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof onUpdateChapters !== "function") return;
    const mapped = formik.values.chapters.map((ch) => ({
      chapterId: ch.id,
      chapterName: ch.chapterName,
      topics: ch.topics.map((t) => ({
        topicId: t.id,
        topicName: t.topicName,
      })),
    }));
    const currJson = JSON.stringify(mapped);
    if (prevChaptersRef.current !== currJson) {
      prevChaptersRef.current = currJson;
      onUpdateChapters(mapped);
    }
  }, [formik.values.chapters, onUpdateChapters]);

  const toggleTopicEdit = (id) =>
    setEditingTopicId((prev) => (prev === id ? null : id));

  const addChapter = () => {
    formik.setFieldValue("chapters", [
      ...formik.values.chapters,
      {
        id: generateUniqueNumber(),
        chapterName: "",
        topics: [
        ],
      },
    ]);
  };

  const removeChapter = (index) => {
    const updated = [...formik.values.chapters];
    updated.splice(index, 1);
    formik.setFieldValue("chapters", updated);
  };

  const addTopicHandler = (chapterIndex: number) => {
    const chapters = [...formik.values.chapters];
    chapters[chapterIndex].topics.push({
      id: generateUniqueNumber(),
      topicName: "",
      sessions: 1,
      week: 1,
      loDetails: [
        {
          id: generateUniqueNumber(),
          loCode: "",
          description: "",
        },
      ],
    });
    formik.setFieldValue("chapters", chapters);
  };

  const removeTopic = (chapterIndex, topicIndex) => {
    const chapters = [...formik.values.chapters];
    chapters[chapterIndex].topics.splice(topicIndex, 1);
    formik.setFieldValue("chapters", chapters);
  };

  const handleChapterDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = formik.values.chapters.findIndex(
      (c) => c.id === active.id
    );
    const newIndex = formik.values.chapters.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(
      formik.values.chapters,
      oldIndex,
      newIndex
    );

    formik.setFieldValue("chapters", reordered);
  };

  const handleTopicDragEnd = ({ active, over }, chapterIndex) => {
    if (!over || active.id === over.id) return;
    let chapter = formik.values.chapters[chapterIndex];
    const oldIndex = chapter.topics.findIndex((t) => t.id === active.id);
    const newIndex = chapter.topics.findIndex((t) => t.id === over.id);
    chapter.topics = arrayMove(chapter.topics, oldIndex, newIndex);
    const updated = [...formik.values.chapters];
    updated[chapterIndex] = chapter;
    formik.setFieldValue("chapters", updated);
  };

  const isAddTopicDisabled = (chapterIndex) => {
    const chapter = formik.values.chapters[chapterIndex];
    if (!chapter.chapterName || chapter.chapterName.trim() === "") {
      return true;
    }
    const topics = chapter.topics;
    if (topics.length === 0) return false;
    const lastTopic = topics[topics.length - 1];
    return !lastTopic.topicName || lastTopic.topicName.trim() === "";
  };

  const hasEmptyTopic = () => {
    return formik.values.chapters.some((ch) =>
      ch.topics.some((t) => !t.topicName || t.topicName.trim() === "")
    );
  };

  const isAddChapterDisabled = () => {
    if (!selectedUnit?.unitTitle || selectedUnit.unitTitle.trim() === "") {
      return true;
    }

    const chapters = formik.values.chapters;
    if (chapters.length === 0) return false;

    const lastChapter = chapters[chapters.length - 1];
    if (!lastChapter.chapterName || lastChapter.chapterName.trim() === "") {
      return true;
    }
    if (hasEmptyTopic()) {
      return true;
    }
    return false;
  };

  return (
    <div className="tw-overflow-hidden tw-flex tw-flex-col tw-rounded-[15px] tw-shadow-lg tw-bg-white tw-h-[590px] tw-border tw-border-gray-200">
      <div className="tw-p-4 tw-border-b tw-flex tw-items-start tw-gap-4 tw-px-8">
        <div className="tw-flex tw-flex-col tw-gap-1">
          <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-800 tw-mb-0">
            {`Unit ${selectedUnitIdx}. ${selectedUnit?.unitTitle ?? "Untitled unit"}`}
          </h4>
          <p className="tw-text-sm tw-text-gray-500 tw-mb-0">
            Unit {selectedUnitIdx} • {selectedUnit?.unitTitle ?? "Untitled unit"}
            {` / ${selectedUnitIdx}.${activeChapterIndex + 1} ${formik.values.chapters[activeChapterIndex]?.chapterName || ""}`}
          </p>
        </div>
        <div className="tw-flex-1 tw-flex tw-justify-end">
          {formik.values.chapters.length > 0 && (
            <button
              onClick={addChapter}
              disabled={isAddChapterDisabled()}
              className={`tw-border tw-px-3 tw-py-2 tw-rounded-lg 
                ${isAddChapterDisabled()
                  ? "tw-border-gray-300 tw-bg-gray-200 tw-text-gray-400 tw-cursor-not-allowed"
                  : "tw-border-[#364574] tw-text-primary hover:tw-text-white hover:tw-bg-[#364574]"
                }`}
            >
              + Add Chapter
            </button>
          )}
        </div>
      </div>
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-mb-6 tw-mt-4">
        <FormikProvider value={formik}>
          <FieldArray name="chapters">
            {(arrayHelpers) => {
              formikArrayHelpers.current = arrayHelpers;
              if (formik.values.chapters.length === 0)
                return (
                  <div className="tw-text-center tw-p-6 tw-bg-gray-100 tw-rounded-lg">
                    <p className="tw-text-gray-500 tw-mb-2">No chapters in this unit yet.</p>
                    <p className="tw-text-gray-500">
                      Click " + Add Chapter" to create the first chapter for this unit.
                    </p>
                    <button
                      onClick={addChapter}
                      disabled={isAddChapterDisabled()}
                      className={`tw-border tw-px-3 tw-py-2 tw-rounded-lg 
                        ${isAddChapterDisabled()
                          ? "tw-border-gray-300 tw-bg-gray-200 tw-text-gray-400 tw-cursor-not-allowed"
                          : "tw-border-[#364574] tw-text-primary hover:tw-text-white hover:tw-bg-[#364574]"
                        }`}
                    >
                      + Add Chapter
                    </button>
                  </div>
                );
              return (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleChapterDragEnd}
                >
                  <SortableContext
                    items={formik.values.chapters.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {formik.values.chapters.map((chapter, chapterIndex) => (
                      <SortableItem key={chapter.id} id={chapter.id}>
                        {({ setNodeRef, style, listeners, attributes }) => (
                          <div ref={setNodeRef} style={style}>
                            <UncontrolledAccordionCard
                              defaultOpen={[`chapter-${chapter.id}`]}
                            >
                              <AccordionCardItem>
                                <AccordionCardHeader
                                  targetId={`chapter-${chapter.id}`}
                                  titleClass="tw-flex tw-items-center tw-w-full tw-flex-grow-1"
                                  accordionHeaderClass="tw-flex tw-items-center tw-justify-between tw-rounded-md"
                                  title={
                                    <div
                                      className="tw-flex tw-items-center tw-w-full tw-gap-2"
                                      onClick={() => setActiveChapterIndex(chapterIndex)}
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => { if (e.key === "Enter") setActiveChapterIndex(chapterIndex); }}
                                    >
                                      <div
                                        {...listeners}
                                        {...attributes}
                                        className="tw-cursor-grab tw-text-gray-500"
                                      >
                                        <HugeiconsIcon icon={DragDropVerticalIcon} size={18} />
                                      </div>
                                      <span className="tw-text-gray-600 tw-w-8 tw-text-center">
                                        {`${selectedUnitIdx}.${chapterIndex + 1}`}
                                      </span>
                                      <div className="tw-flex tw-items-center tw-w-full">
                                        <div className="tw-flex tw-flex-col tw-flex-grow-1 tw-pr-3">
                                          <span className="tw-flex-1 tw-font-medium tw-text-gray-800">
                                            {chapter.chapterName || "Untitled Chapter"}
                                          </span>
                                        </div>
                                        <div className="tw-flex tw-items-center ms-auto tw-gap-3">
                                          <HugeiconsIcon
                                            icon={Delete02StrokeStandard}
                                            size={18}
                                            className="tw-text-gray-700 tw-cursor-pointer tw-mr-2"
                                            onClick={() => removeChapter(chapterIndex)}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  }
                                />
                                <AccordionCardBody
                                  accordionId={`chapter-${chapter.id}`}
                                >
                                  <div className="tw-space-y-4">
                                    <TextInput
                                      name={`chapters.${chapterIndex}.chapterName`}
                                      labelText="Chapter Name"
                                      value={
                                        formik.values.chapters[chapterIndex]
                                          .chapterName
                                      }
                                      onChange={(e) => {
                                        setActiveChapterIndex(chapterIndex);
                                        formik.handleChange(e);
                                      }}
                                    />
                                    <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={(e) =>
                                        handleTopicDragEnd(e, chapterIndex)
                                      }
                                    >
                                      <SortableContext
                                        items={chapter.topics.map((t) => t.id)}
                                        strategy={
                                          verticalListSortingStrategy
                                        }
                                      >
                                        {chapter.topics.map(
                                          (topic, topicIndex) => {
                                            const key = `${chapterIndex}-${topicIndex}-${topic.id}`;
                                            const isEditing =
                                              editingTopicId === key;

                                            return (
                                              <SortableItem
                                                id={topic.id}
                                                key={topic.id}
                                              >
                                                {({
                                                  setNodeRef,
                                                  style,
                                                  listeners,
                                                  attributes,
                                                }) => (
                                                  <div
                                                    ref={setNodeRef}
                                                    style={style}
                                                    className="tw-bg-[#4051890D] tw-rounded-lg tw-p-3 tw-flex tw-items-center tw-gap-3 tw-mb-2"
                                                  >
                                                    <div
                                                      className={
                                                        isEditing
                                                          ? "tw-cursor-default"
                                                          : "tw-cursor-grab"
                                                      }
                                                      {...(!isEditing
                                                        ? {
                                                          ...listeners,
                                                          ...attributes,
                                                        }
                                                        : {})}
                                                    >
                                                      <HugeiconsIcon
                                                        icon={DragDropVerticalIcon}
                                                        size={18}
                                                      />
                                                    </div>
                                                    <div className="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                                      {isEditing ? (
                                                        <TextInput
                                                          name={`chapters.${chapterIndex}.topics.${topicIndex}.topicName`}
                                                          value={formik.values.chapters[chapterIndex].topics[topicIndex].topicName}
                                                          onChange={formik.handleChange}
                                                          formgroupClassName="mb-0 w-75"
                                                          inputClassName="tw-bg-white tw-border tw-rounded tw-px-2 tw-py-1 tw-w-full"
                                                          autoFocus={true}
                                                        />
                                                      ) : (
                                                        <span>
                                                          {selectedUnitIdx}.
                                                          {chapterIndex + 1}.
                                                          {topicIndex + 1}{" "}
                                                          {topic.topicName ||
                                                            "Untitled Topic"}
                                                        </span>
                                                      )}
                                                      <div className="tw-flex tw-gap-2">
                                                        <HugeiconsIcon
                                                          icon={Edit01StrokeStandard}
                                                          size={18}
                                                          className="tw-cursor-pointer"
                                                          onClick={() => {
                                                            setActiveChapterIndex(chapterIndex);
                                                            toggleTopicEdit(key);
                                                          }}
                                                        />
                                                        <HugeiconsIcon
                                                          icon={Delete02StrokeStandard}
                                                          size={18}
                                                          className="tw-cursor-pointer"
                                                          onClick={() => {
                                                            setActiveChapterIndex(chapterIndex);
                                                            removeTopic(chapterIndex, topicIndex);
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </SortableItem>
                                            );
                                          }
                                        )}
                                      </SortableContext>
                                    </DndContext>
                                    <button
                                      disabled={isAddTopicDisabled(chapterIndex)}
                                      onClick={() => {
                                        setActiveChapterIndex(chapterIndex);
                                        addTopicHandler(chapterIndex);
                                      }}
                                      className={`tw-w-full tw-mt-4 tw-border-2 tw-border-dashed tw-rounded-[8px] tw-text-[14px] tw-font-medium tw-py-3 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition tw-duration-200
                                        ${isAddTopicDisabled(chapterIndex)
                                          ? "tw-border-gray-300 tw-bg-gray-200 tw-text-gray-400 tw-cursor-not-allowed"
                                          : "tw-border-gray-300 tw-bg-white tw-text-[#6b7280] hover:tw-bg-[#f3f4f6]"
                                        }`}
                                      type="button"
                                    >
                                      <i className="ri-add-line tw-mr-2" />
                                      Add Topic
                                    </button>
                                  </div>
                                </AccordionCardBody>
                              </AccordionCardItem>
                            </UncontrolledAccordionCard>
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
  );
};

export default CurriculumSetup;
