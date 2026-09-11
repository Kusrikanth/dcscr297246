import React, { useState } from 'react'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropIcon } from "@hugeicons-pro/core-stroke-standard";
import { savePreparatoryDomainOrderAct } from '../../../../../../store/examination/examinationsettings/examinationsettingsaction';
import { useAppDispatch } from '../../../../../../hooks/storehook';
import { generateActionPayload } from '../../../../../../utility/reduxutility';

const SortableItem = ({ id, item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const { name } = item || {};
    const style : React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "10px",
        margin: "5px 0",
        background: "#F0F0F0",
        fontWeight: "bold",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <span {...attributes} {...listeners} style={{ marginRight: "10px" }}>
                    <HugeiconsIcon style={{ cursor: "grab", }} icon={DragDropIcon} size={28} color={"black"} />
                </span>
                <div>
                    <span>{name}</span>
                </div>
            </div>
        </div>
    );
};

const DisplayOrderModal = (props: any) => {
    const { modalData, formValues, showApiLoader } = props || {};
    const dispatch = useAppDispatch();
    const [list, setList] = useState(() => {
        if (Array.isArray(modalData) && modalData.length > 0) {
            return modalData || [];
        }
        return [];
    });

    const handleDragEnd = (event: any) => {
        const { active, over } = event || {};
        if (active.id !== over.id) {
            setList((prevList) => {
                const oldIndex = prevList.findIndex((subject) => +subject.id === +active.id);
                const newIndex = prevList.findIndex((subject) => +subject.id === +over.id);
                return arrayMove(prevList, oldIndex, newIndex);
            });
        }
    };

    const submitHndler = () => {    

        const payload =  list.map((item: any, index: number) => ({
                id: item.id,
                orderNum: (index + 1).toString()
            }))        
        dispatch(savePreparatoryDomainOrderAct(
            generateActionPayload(
                "save_preparatory_domain_order", 
                undefined, 
                payload
            )
        ));
    };

    return (
        <>
            <div className='p-4'>                
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={list.map((subject: any) => subject.id)} strategy={verticalListSortingStrategy}>
                        <div className="subjects-list">
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
                        className={`btn btn-success`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default DisplayOrderModal;