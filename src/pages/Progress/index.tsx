import React, { useState } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignCircleIcon, PlusSignIcon } from '@hugeicons-pro/core-stroke-standard';
import { twMerge } from "tailwind-merge";
import { nanoid } from 'nanoid';

function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: props.data
    });
    return (
        <div ref={setNodeRef} data-id={props.id} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
}

function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });

    return (
        <div ref={setNodeRef} className={twMerge(isOver ? 'tw-bg-green-400' : '')}>
            {props.children}
        </div >
    );
}

const initialitesm = [{
    id: nanoid(),
    value: '1'
}, {
    id: nanoid(),
    value: '2'
}, {
    id: nanoid(),
    value: '3'
}, {
    id: nanoid(),
    value: '4'
}];
export default function Progress() {
    const [items, setItems] = useState(initialitesm);
    const [activeId, setActiveId] = useState(null);
    const [droppedDict, setDroppedDict] = useState<any>({});
    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        if (event.over && event.over.id === 'test1') {
            setDroppedDict(prevState => ({ ...prevState, [event.over.id]: event.active?.data.current?.value }));

            console.log(event);
            setItems(prevState => {
                return prevState.map(item => {
                    if (item.id === event.active.id) {
                        return { ...item, id: nanoid() }
                    }
                    return item;
                })
            })
        }
        setActiveId(null);
    }

    console.log(droppedDict);
    return (
        <div className='page-content'>
            <div className='tw-p-5 tw-bg-white tw-rounded-lg'>
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className='tw-grid tw-grid-cols-4 tw-gap-4'>
                        <div className='tw-col-span-1'>

                            <div className='tw-list-none tw-m-0 tw-p-0'>
                                {items.map(item =>
                                    <Draggable key={item.id} id={item.id} data={item}>
                                        <div className='tw-px-2 tw-py-2 tw-border tw-rounded
                                tw-border-gray-400 tw-mb-2'>{`Item-${item.value}`}</div>
                                    </Draggable>
                                )}
                            </div>

                            <DragOverlay>
                                {activeId ? (
                                    <div className='tw-p-2 tw-border-dashed  tw-rounded
                                tw-border-gray-400 tw-bg-red-400'>dsfdsf{`Item-${activeId}`}</div>
                                ) : <div>sfsdfds</div>}
                            </DragOverlay>
                        </div>
                        <div className='tw-col-span-3'>
                            <div className='tw-grid tw-grid-cols-3 tw-gap-3'>
                                <Droppable id="test1">
                                    {droppedDict?.test1 ? <>
                                        <div className={twMerge(`tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            `)}>
                                            {`value-${droppedDict?.test1}`}
                                        </div>
                                    </> : <div className={twMerge(`tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            `)}>
                                        <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                                    </div>}

                                </Droppable>

                                {/* <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div>
                            <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div>
                            <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div>
                            <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div>
                            <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div>
                            <div className='tw-p-2 tw-flex tw-items-center tw-justify-center
                             tw-border tw-rounded
                                tw-border-gray-400 tw-aspect-video
                            '>
                                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                            </div> */}


                            </div>
                        </div>
                    </div>
                </DndContext>

            </div>
        </div>

    );


}