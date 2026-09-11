import { DragOverlay, useDraggable } from "@dnd-kit/core";

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

const SubjectsList = ({ activeDragSubject = null, subjects }: any) => {
  return (
    <div >
      {subjects?.map((subject: any) => (
        <Draggable key={subject.subjectId} id={subject.subjectId} data={subject}>
          <div
            className="tw-bg-white tw-border tw-shadow-none tw-rounded-lg tw-mb-2"
            key={subject.subjectName}
          >
            <div className="tw-p-4">
              <p className="tw-mb-1">{subject.subjectName}</p>
              <p className="tw-mb-0 tw-text-gray-500 tw-text-sm">{subject.teacherName}</p>
              <p className="tw-mb-0 tw-text-gray-500 tw-text-xs">({subject.subjectType})</p>
            </div>
          </div>
        </Draggable>
      ))}

      <DragOverlay>
        {activeDragSubject ? (
          <div className="tw-py-3 tw-px-4 tw-flex tw-flex-col tw-bg-white tw-border tw-border-[#e5e7eb] tw-rounded-md tw-min-w-36">
            <h3 className="tw-text-base tw-text-nowrap tw-truncate">
              {activeDragSubject?.subjectName}
            </h3>
            <span className="tw-text-gray-500">{activeDragSubject?.teacherName}</span>
          </div>
        ) : <></>}
      </DragOverlay>
    </div >
  );
};

export default SubjectsList;
