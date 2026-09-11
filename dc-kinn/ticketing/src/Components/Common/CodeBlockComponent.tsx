import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, FileEditIcon } from "@hugeicons-pro/core-stroke-standard";

export const CodeBlockComponent = (props: any) => {
  const { node, editor, deleteNode } = props;
  const language = node.attrs.language;

  // This function is passed from the parent to open the modal for editing
  const handleEdit = () => {
    props.extension.options.onEdit(props);
  };

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="code-block-header" contentEditable="false">
        <span className="language-label">{language || 'code'}</span>
        <div className="code-block-actions">
          <button onClick={handleEdit} className="btn btn-sm btn-outline-secondary">
            <HugeiconsIcon icon={FileEditIcon} size={16} />
          </button>
          <button onClick={deleteNode} className="btn btn-sm btn-outline-danger ms-1">
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </button>
        </div>
      </div>
      <pre className='!tw-p-3'>
        <NodeViewContent />
      </pre>
    </NodeViewWrapper>
  );
};