import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({
  id,
  children,
}: {
  id: string | number;
  children: (props: {
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    listeners: any;
    attributes: any;
  }) => React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <>{children({ setNodeRef, style, listeners, attributes })}</>;
};

export default SortableItem;
