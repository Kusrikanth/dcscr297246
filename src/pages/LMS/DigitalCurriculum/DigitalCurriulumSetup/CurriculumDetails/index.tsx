import { CircleArrowLeft01Icon, CircleArrowRight01Icon, Delete02StrokeStandard, Edit01StrokeStandard, DragDropVerticalIcon, CheckmarkCircle04Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import CurriculumSetup from "./CurriculumSetup";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import { TextInput } from "../../../../../Components/Common";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "../../../../../Components/Common/SortableItem";
import { StepperFormContext } from "../helper";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getDigitalCurriculumManualUploadByIdAct, resetDigitalCurriculumManualUploadByIdAct, resetSaveDigitalCurriculumManualUploadAct, saveDigitalCurriculumManualUploadAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { StepperFormContextRequestChange } from "../../CurriculumPlannerList/EditCurriculumStructureModal/helper";

interface IUnit {
  id: string;
  unitTitle: string;
  color: string;
  chapters: any[];
}

const initialValues = {
  // unitName: "",
  units: [],
};
interface CurriculumDetailsProps {
  subjectCurriculumId?: number | null;
  toggle: any;
  redirectToReview?: boolean;
}

const CurriculumDetails: React.FC<CurriculumDetailsProps> = (props) => {

  const [openId, setOpenId] = useState<string>("");
  const dispatch = useAppDispatch();
  const stepperContext = useContext(StepperFormContext);
  const stepperContextRequestChange = useContext(StepperFormContextRequestChange);
  const location = useLocation();
  const isRequestChange = location.pathname === "/digital-curriculum";
  const makeLocalId = () => crypto.randomUUID();

  const ctx = isRequestChange ? stepperContextRequestChange : stepperContext;
  const isBulkUpload = ctx?.isBulkUpload;
  const goToNextStep = ctx?.goToNextStep;
  const goToPreviousStep = ctx?.goToPreviousStep;
  const subjectCurriculumId = props.subjectCurriculumId ?? ctx?.subjectCurriculumId;

  const isUsingRequestChangeCtx = isRequestChange;
  const [editingUnitId, setEditingUnitId] = useState<any>(null);

  const { getDigitalCurriculumanualUploadByIdResp,
    saveDigitalCurriculumanualUploadResp, lmsdigitalcurriculumErrorAct }
    = useAppSelector(
      ({ lmsdigitalcurriculum }) => ({
        getDigitalCurriculumanualUploadByIdResp: lmsdigitalcurriculum.getDigitalCurriculumanualUploadByIdResp,
        saveDigitalCurriculumanualUploadResp: lmsdigitalcurriculum.saveDigitalCurriculumanualUploadResp,
        lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      }),
      shallowEqual
    );
  const bulkUploadRef = useRef<any>({
    prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
    prevSaveDigitalCurriculumManualUploadResp: saveDigitalCurriculumanualUploadResp,
  });

  useEffect(() => {
    const {
      prevSaveDigitalCurriculumManualUploadResp,
      prevLmsdigitalcurriculumErrorAct,
    } = bulkUploadRef.current;

    if (
      lmsdigitalcurriculumErrorAct &&
      prevLmsdigitalcurriculumErrorAct !== lmsdigitalcurriculumErrorAct
    ) {
      toast.error(
        lmsdigitalcurriculumErrorAct.details ||
        lmsdigitalcurriculumErrorAct.ERROR ||
        "Something went wrong."
      );
    }

    if (
      saveDigitalCurriculumanualUploadResp &&
      prevSaveDigitalCurriculumManualUploadResp !==
      saveDigitalCurriculumanualUploadResp
    ) {
      toast.success("Manual Upload Successfully Completed.");
      goToNextStep?.();
      dispatch(resetSaveDigitalCurriculumManualUploadAct(undefined));
    }

    bulkUploadRef.current.prevLmsdigitalcurriculumErrorAct =
      lmsdigitalcurriculumErrorAct;
    bulkUploadRef.current.prevSaveDigitalCurriculumManualUploadResp =
      saveDigitalCurriculumanualUploadResp;
  }, [
    lmsdigitalcurriculumErrorAct,
    saveDigitalCurriculumanualUploadResp,
    goToNextStep,
    dispatch,
  ]);

  useEffect(() => {
    if (!getDigitalCurriculumanualUploadByIdResp?.units) return;

    const mappedUnits = getDigitalCurriculumanualUploadByIdResp.units.map((u: any) => {
      const localUnitId = makeLocalId();

      return {
        id: localUnitId,
        apiId: u.id ?? null,
        unitTitle: u.title,
        color: "tw-bg-green-500",
        chapters: (u.chapters || []).map((ch: any) => {
          const localChapterId = makeLocalId();

          return {
            chapterId: localChapterId,
            apiId: ch.id ?? null,
            chapterName: ch.title,
            topics: (ch.topics || []).map((t: any) => {
              const localTopicId = makeLocalId();

              return {
                topicId: localTopicId,
                apiId: t.id ?? null,
                topicName: t.title,
                subjectLos: t.subjectLos || [],
              };
            }),
          };
        }),
      };
    });

    unitDetailsForm.setFieldValue("units", mappedUnits);

    if (mappedUnits.length) setOpenId(`unit-${mappedUnits[0].id}`);
  }, [getDigitalCurriculumanualUploadByIdResp]);


  useEffect(() => {
    if (isBulkUpload && subjectCurriculumId) {
      dispatch(
        getDigitalCurriculumManualUploadByIdAct(
          generateActionPayload(
            "get_digital_curriculum_manual_upload_by_id",
            { subjectCurriculumId: subjectCurriculumId },
            undefined
          )
        )
      );
    }
  }, [subjectCurriculumId]);

  useEffect(() => {
    dispatch(resetDigitalCurriculumManualUploadByIdAct(undefined));
  }, []);
  const toApiId = (v: any) => (typeof v === "number" ? v : "");

  const mapUnits = (units: any[]) => {
    return units.map((unit: any, uIdx: number) => ({
      id: toApiId(unit.apiId),
      title: unit.unitTitle,
      unitIndex: `U${uIdx + 1}`,
      sortIndex: uIdx + 1,
      chapters: (unit.chapters || []).map((ch: any, cIdx: number) => ({
        id: toApiId(ch.apiId),
        title: ch.chapterName,
        chapterIndex: `C${cIdx + 1}`,
        sortIndex: cIdx + 1,
        topics: (ch.topics || []).map((t: any, tIdx: number) => ({
          id: toApiId(t.apiId),
          title: t.topicName,
          topicIndex: `T${tIdx + 1}`,
          sortIndex: tIdx + 1,
          subjectLos: t.subjectLos || [],
        })),
      })),
    }));
  };

  const buildPayload = () => {
    return { units: mapUnits(unitDetailsForm.values.units) };
  };

  const validateBeforeNext = () => {
    const units: any[] = unitDetailsForm.values.units || [];
    if (!units.length) return "Please add at least one Unit.";

    for (const unit of units) {
      if (!unit.unitTitle?.trim()) return "Unit title is required.";
      if (!unit.chapters?.length) return "Each unit must have at least one Chapter.";
      for (const ch of unit.chapters) {
        if (!ch.topics?.length) return "Each chapter must have at least one Topic.";
      }
    }
    return "";
  };

  const handleNext = () => {
    const err = validateBeforeNext();
    if (err) {
      toast.error(err);
      return;
    }

    const payload = buildPayload();
    if (subjectCurriculumId) {
      dispatch(
        saveDigitalCurriculumManualUploadAct(
          generateActionPayload(
            "save_digital_curriculum_manual_upload",
            { subjectCurriculumId },
            payload
          )
        )
      );
    }
  };

  const EditHandler = (unit: any) => {
    setEditingUnitId(
      editingUnitId === unit.id ? null : unit.id
    );
  };

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const pendingOpenRef = useRef<any>(null);

  const addFunction = () => {
    const nextId = makeLocalId();
    const newUnit = {
      id: nextId,
      apiId: "",
      unitTitle: "",
      color: "tw-bg-red-500",
      chapters: [],
    };
    const updatedUnits = [...(unitDetailsForm.values.units || []), newUnit];
    unitDetailsForm.setFieldValue("units", updatedUnits);
    setOpenId(`unit-${nextId}`);
    setEditingUnitId(nextId);
    unitDetailsForm.setFieldValue("unitName", "New Unit");
  };

  const unitDetailsForm = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: () => { },
  });

  useEffect(() => {
    if (pendingOpenRef.current == null) return;
    const id = pendingOpenRef.current;
    if ((unitDetailsForm.values.units || []).some((u: any) => u.id === id)) {
      setOpenId(`unit-${id}`);
      pendingOpenRef.current = null;
    }
  }, [unitDetailsForm.values.units]);

  const units: IUnit[] = unitDetailsForm.values.units || [];

  const isAddDisabled = () => {
    if (!units.length) return false;

    const lastUnit = units[units.length - 1];
    return !lastUnit.unitTitle || lastUnit.unitTitle.trim() === "";
  };

  const selectedUnit: any = useMemo(() => {
    if (!units?.length || !openId) return null;
    const match = openId.match(/^unit-(.+)$/);
    if (!match) return null;
    const id = match[1];
    return units.find((u: any) => String(u.id) === id) || null;
  }, [units, openId]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleUnitDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = units.findIndex((u: any) => u.id === active.id);
    const newIndex = units.findIndex((u: any) => u.id === over.id);
    const reordered = arrayMove(units, oldIndex, newIndex);
    unitDetailsForm.setFieldValue("units", reordered);
  };

  const isNextDisabled = () => {
    const units: any[] = unitDetailsForm.values.units as any[];
    if (!units || units.length === 0) return true;
    for (const unit of units) {
      if (!unit.chapters || unit.chapters.length === 0) return true;
      for (const ch of unit.chapters) {
        if (!ch.topics || ch.topics.length === 0) return true;
      }
    }
    return false;
  };

  const getUnitStatusColor = (unit: any) => {
    const hasChapters = unit.chapters && unit.chapters.length > 0;
    const hasTopics =
      hasChapters &&
      unit.chapters.some((ch: any) => ch.topics && ch.topics.length > 0);
    if (!hasChapters) return "tw-bg-red-500";
    const allChaptersEmpty = unit.chapters.every(
      (ch: any) => !ch.topics || ch.topics.length === 0
    );
    if (allChaptersEmpty) return "tw-bg-yellow-500";
    return "tw-bg-green-500";
  };

  const safeUnits = useMemo(
    () => (units || []).filter(u => u && u.id != null),
    [units]
  );

  useEffect(() => {
    return () => {
      setOpenId("");
      setEditingUnitId(null);
    };
  }, []);

  return (
    <FormikProvider value={unitDetailsForm}>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        {!isRequestChange && getDigitalCurriculumanualUploadByIdResp?.units?.length > 0 && (
          <div className="tw-col-span-12">
            <div className="tw-rounded-lg tw-border tw-border-[#6AD48B] tw-bg-[#F0FDF4] tw-p-4">
              <h4 className="tw-flex tw-items-center tw-mb-0 tw-text-[#18AC46] tw-font-semibold tw-text-base">
                <HugeiconsIcon
                  icon={CheckmarkCircle04Icon}
                  size={20}
                  color="#16A34A"
                  strokeWidth={1.5}
                  className="tw-mr-2"
                />
                Curriculum Structure has been created with{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="tw-text-[#18AC46] hover:tw-text-[#16A34A] tw-font-medium tw-ml-2 tw-underline tw-decoration-[#18AC46] tw-underline-offset-2"
                >
                  file.csv
                </a>
              </h4>
              <p className="tw-ml-6 tw-pl-1 tw-text-sm tw-text-[#18AC46] tw-mb-0 tw-pt-1">
                Your curriculum data has been successfully processed.
              </p>
            </div>
          </div>
        )}
        <div className="tw-col-span-12 lg:tw-col-span-4">
          <div className={`tw-overflow-hidden tw-flex tw-flex-col tw-rounded-xl tw-shadow-lg tw-bg-white tw-h-[590px]`}>
            <div className="tw-border-b tw-px-4 tw-py-3">
              <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-800 tw-my-2">Setup Summary</h4>
              <div className="tw-flex tw-flex-col tw-gap-2 tw-text-gray-500 tw-text-sm">
                <div className="tw-flex tw-flex-wrap tw-gap-4">
                  <p className="tw-flex tw-items-center mb-0">
                    <span>Units :</span>
                    <span className="tw-font-semibold tw-ml-1">{units.length}</span>
                  </p>
                  <p className="tw-flex tw-items-center mb-0">
                    <span>Chapters :</span>
                    <span className="tw-font-semibold tw-ml-1">
                      {units.reduce((sum, u: any) => sum + (u.chapters?.length || 0), 0)}
                    </span>
                  </p>
                  <p className="tw-flex tw-items-center mb-0">
                    <span>Topics :</span>
                    <span className="tw-font-semibold tw-ml-1">
                      {units.reduce(
                        (sum, u: any) =>
                          sum +
                          (u.chapters?.reduce((s, c) => s + (c.topics?.length || 0), 0) || 0),
                        0
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="card-body tw-flex-1 tw-overflow-y-auto tw-pr-2 tw-mt-4">
              <FieldArray name="units">
                {(arrayHelpers: ArrayHelpers) => {
                  formikArrayHelpers.current = arrayHelpers;
                  if (!units.length)
                    return (
                      <div className="tw-text-center tw-py-6 tw-bg-gray-100 tw-border-dashed tw-border rounded">
                        <p className="tw-text-gray-500 tw-my-3">No units have been added yet.</p>
                        <p className="tw-text-gray-500 tw-my-3">Click “+ Add Unit” to create your first unit.</p>
                      </div>
                    );
                  return (
                    <>
                      {safeUnits.length > 0 && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleUnitDragEnd}
                        >
                          <SortableContext
                            items={safeUnits.map(u => u.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <Accordion open={openId} toggle={(id) => setOpenId(id)}>
                              {safeUnits.map((unit, idx) => (
                                <SortableItem id={unit.id} key={unit.id}>
                                  {({ setNodeRef, style, listeners, attributes }) => (
                                    <div ref={setNodeRef} style={style}>
                                      <AccordionItem>
                                        <AccordionHeader
                                          targetId={`unit-${unit.id}`}
                                          onClick={() => {
                                            setOpenId(`unit-${unit.id}`);
                                            unitDetailsForm.setFieldValue("unitName", "New Unit");
                                          }}
                                          className="tw-flex tw-items-center tw-justify-between tw-w-full tw-border tw-rounded-md tw-bg-white hover:tw-bg-gray-50"
                                        >
                                          <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                                            <span
                                              {...listeners}
                                              {...attributes}
                                              onClick={(e) => e.stopPropagation()}
                                              className="tw-cursor-grab tw-text-gray-400"
                                            >
                                              <HugeiconsIcon icon={DragDropVerticalIcon} size={18} />
                                            </span>
                                            <span className={`tw-w-3 tw-h-3 tw-rounded-full ${getUnitStatusColor(unit)}`} />
                                            {editingUnitId === unit.id ? (
                                              <TextInput
                                                name={`units.${idx}.unitTitle`}
                                                value={unit.unitTitle}
                                                onChange={(e) => {
                                                  const updatedUnits = [...units];

                                                  updatedUnits[idx] = {
                                                    ...updatedUnits[idx],
                                                    unitTitle: e.target.value,
                                                  };

                                                  unitDetailsForm.setFieldValue("units", updatedUnits);
                                                }}
                                                inputClassName="tw-bg-white tw-border tw-rounded tw-px-2 tw-py-1 tw-w-full"
                                                formgroupClassName="mb-0"
                                                autoFocus={true}
                                              />
                                            ) : (
                                              <span
                                                className="tw-font-medium tw-text-gray-800 tw-truncate tw-max-w-[190px]"
                                                title={`${idx + 1}. ${unit.unitTitle}`}
                                              >
                                                {idx + 1}. {unit.unitTitle}
                                              </span>
                                            )}
                                          </div>
                                          <div className="tw-flex tw-items-center tw-gap-3">
                                            <HugeiconsIcon
                                              icon={Edit01StrokeStandard}
                                              size={18}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                EditHandler(unit);
                                              }}
                                              className="tw-cursor-pointer"
                                            />
                                            <HugeiconsIcon
                                              icon={Delete02StrokeStandard}
                                              size={18}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newList = units.filter((u: any) => u.id !== unit.id);
                                                unitDetailsForm.setFieldValue("units", newList);
                                              }}
                                              className="tw-cursor-pointer tw-mr-3"
                                            />
                                          </div>
                                        </AccordionHeader>
                                        <AccordionBody accordionId={`unit-${unit.id}`}>
                                          <div className="tw-pl-4">
                                            {(unit.chapters || []).map((ch, cIdx) => (
                                              <div key={ch.chapterId ?? `${unit.id}-ch-${cIdx}`} className="tw-mb-2">
                                                <p className="tw-font-medium">
                                                  {idx + 1}.{cIdx + 1}. {ch.chapterName}
                                                </p>
                                                <div className="tw-ml-4">
                                                  {(ch.topics || []).map((t, tIdx) => (
                                                    <p key={t.topicId ?? `${unit.id}-ch-${cIdx}-t-${tIdx}`} className="tw-text-xs tw-text-gray-600">
                                                      {idx + 1}.{cIdx + 1}.{tIdx + 1}. {t.topicName}
                                                    </p>
                                                  ))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </AccordionBody>
                                      </AccordionItem>
                                    </div>
                                  )}
                                </SortableItem>
                              ))}
                            </Accordion>
                          </SortableContext>
                        </DndContext>
                      )}
                    </>
                  );
                }}
              </FieldArray>
            </div>
            <div className="tw-p-4 tw-border-t">
              <button
                onClick={addFunction}
                disabled={isAddDisabled()}
                className={`tw-border tw-w-full tw-py-2 tw-rounded-lg ${isAddDisabled() ? "tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed" : "tw-bg-[#364574] tw-text-white"}`}
              >
                + Add Unit
              </button>
            </div>
          </div>
        </div>
        <div className="tw-col-span-12 lg:tw-col-span-8">
          <CurriculumSetup
            selectedUnit={selectedUnit}
            unitsList={units}
            onUpdateChapters={(updatedChapters) => {
              if (!selectedUnit) return;
              const updatedUnits = unitDetailsForm.values.units.map((u: any) =>
                u.id === selectedUnit.id ? { ...u, chapters: updatedChapters } : u
              );
              unitDetailsForm.setFieldValue("units", updatedUnits);
            }}
          />
        </div>
      </div>
      <div className="tw-flex tw-justify-between tw-mt-10">
        {isUsingRequestChangeCtx ? (
          <button
            type="button"
            onClick={props.toggle}
            className="tw-border tw-border-black tw-rounded-lg tw-px-4 tw-py-2"
          >
            <HugeiconsIcon icon={CircleArrowLeft01Icon} size={20} className="tw-mr-1" />
            Cancel
          </button>
        ) : goToPreviousStep ? (
          <button
            type="button"
            onClick={goToPreviousStep}
            className="tw-border tw-border-black tw-rounded-lg tw-px-4 tw-py-2"
          >
            <HugeiconsIcon icon={CircleArrowLeft01Icon} size={20} className="tw-mr-1" />
            Previous
          </button>
        ) : (
          <button
            type="button"
            onClick={props.toggle}
            className="tw-border tw-border-black tw-rounded-lg tw-px-4 tw-py-2"
          >
            <HugeiconsIcon icon={CircleArrowLeft01Icon} size={20} className="tw-mr-1" />
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNext();
          }}
          disabled={isNextDisabled()}
          className={`tw-rounded-lg tw-px-4 tw-py-2 ${isNextDisabled()
            ? "tw-bg-gray-300 tw-text-gray-600 tw-cursor-not-allowed"
            : "tw-bg-[#0ab39c] tw-text-white"
            }`}
        >
          Next <HugeiconsIcon icon={CircleArrowRight01Icon} size={20} className="tw-ml-1" />
        </button>
      </div>
    </FormikProvider>
  );
};

export default CurriculumDetails;
