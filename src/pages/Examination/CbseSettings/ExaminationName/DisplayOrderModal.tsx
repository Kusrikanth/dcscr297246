import React, { useState } from 'react'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropIcon } from "@hugeicons-pro/core-stroke-standard";
import { changeDisplayOrderExamAct } from '../../../../store/examination/examinationsettings/examinationsettingsaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppDispatch } from '../../../../hooks/storehook';

const SortableItem = ({ id, item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const { examinationName } = item || {}
    const style : React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "10px",
        margin: "5px 0",
        background: "#F0F0F0",
        fontWeight: "bold",
        borderRadius: "5px"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <span {...attributes} {...listeners} style={{ marginRight: "10px" }}>
                <HugeiconsIcon style={{ cursor: "grab", }} icon={DragDropIcon} size={28} color={"black"} />
            </span>
            <span>{examinationName}</span>
        </div>
    );
};

const DisplayOrderModal = (props: any) => {
    const { modalData, formValues , showApiLoader } = props || {}
    const dispatch = useAppDispatch();
    const [list, setList] = useState(Array.isArray(modalData) ? modalData : []);

    const handleDragEnd = (event: any) => {
        const { active, over } = event || {};
        if (active.id !== over.id) {
            setList((prevList) => {
                const oldIndex = prevList.findIndex((city) => +city.id === +active.id);
                const newIndex = prevList.findIndex((city) => +city.id === +over.id);
                return arrayMove(prevList, oldIndex, newIndex);
            });
        }
    };

    const submitHndler = () => {
        const { academicYearId, curriculumId, classId } = formValues || {}
        const payload = {
            academicYearId, curriculumId, classId,
            displayOrderDto: list.map((item: any, index: number) => ({
                examinationId: item.id,
                displayOrder: index + 1
            }))
        }
        dispatch(changeDisplayOrderExamAct(generateActionPayload("change_display_order_examination", undefined, payload)));
    }

    return (
        <>
            <div className='p-4'>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={list.map((city: any) => city.id)} strategy={verticalListSortingStrategy}>
                        <div className="city-list">
                            {list.map((item: any) => (
                                <SortableItem key={item.id} id={item.id} item={item} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                <div className="hstack gap-2 justify-content-end mt-4 mb-1">
                    <button
                        type="button"
                        className={"btn btn-light"}
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={submitHndler}
                        disabled={showApiLoader}
                        className={`btn btn-success`} >
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}

export default DisplayOrderModal