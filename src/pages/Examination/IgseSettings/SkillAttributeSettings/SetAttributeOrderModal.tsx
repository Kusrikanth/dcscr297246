import React, { useEffect, useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropIcon } from "@hugeicons-pro/core-stroke-standard";
import {
  saveSetSkillAttributeOrderAct,
  saveSetSkillOrderAct,
} from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const SortableItem = ({ id, item }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    margin: "5px 0",
    background: "#F0F0F0",
    fontWeight: "bold",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <span {...attributes} {...listeners} style={{ cursor: "grab" }}>
        <HugeiconsIcon icon={DragDropIcon} size={28} color="black" />
      </span>
      <span>{item?.attributeName}</span>
    </div>
  );
};

const SetAttributeOrderModal = (props: any) => {
  const { modalData, formValues, showApiLoader, selectedItemId } = props || {};
  const dispatch = useAppDispatch();

  const [list, setList] = useState<any[]>(
    Array.isArray(modalData) ? modalData : []
  );

  useEffect(() => {
    setList(Array.isArray(modalData) ? modalData : []);
  }, [modalData]);

  const { currentBranchIdResp: branchId } = useAppSelector(
    ({ appData }: any) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event || {};
    if (!over) return;

    if (active.id !== over.id) {
      setList((prevList) => {
        const oldIndex = prevList.findIndex((x) => x.attributeId === active.id);
        const newIndex = prevList.findIndex((x) => x.attributeId === over.id);
        if (oldIndex < 0 || newIndex < 0) return prevList;
        return arrayMove(prevList, oldIndex, newIndex);
      });
    }
  };

  const submitHndler = () => {
    const { academicYearId, curriculumId } = formValues || {};

    const payload = {
      academicYearId,
      curriculumId,
      branchId,
      skillEntryId: +selectedItemId,
      attributeOrder: list.map((item: any, index: number) => ({
        attributeId: item.attributeId,
        sequenceOrder: index + 1,
      })),
    };

    dispatch(
      saveSetSkillAttributeOrderAct(
        generateActionPayload(
          "save_set_skill_attribute_order",
          undefined,
          payload
        )
      )
    );
  };

  return (
    <div className="p-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={list.map((x: any) => x.attributeId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="city-list">
            {list.map((item: any) => (
              <SortableItem
                key={item.attributeId}
                id={item.attributeId}
                item={item}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="hstack gap-2 justify-content-end mt-4 mb-1">
        <button type="button" className="btn btn-light" onClick={props.toggle}>
          Cancel
        </button>
        <button
          type="button"
          onClick={submitHndler}
          disabled={showApiLoader}
          className="btn btn-success"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SetAttributeOrderModal;
