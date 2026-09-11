import React, { useRef, useState } from 'react'
import { Editor } from "@tiptap/react";
import { useModal } from '../../hooks/modalhook';
import classnames from "classnames";
import { HugeiconsIcon } from '@hugeicons/react';
import { Image02Icon } from '@hugeicons-pro/core-stroke-standard';
import { ModalContainerUpdated } from './ModalContainer';
import { BrowseFile } from './FileUpload';
import { TextInput } from './TextInput';
import {CustomTooltip} from './index';
import { uploadFile2mbErrorHndlr } from '../../utility/commonutility';

function resizeImageToBase64(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL(file.type || 'image/png');
        resolve(base64);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const ImageInsertModal = ({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (data: {
    src: string;
    alt: string;
    width: string;
    height: string;
  }) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [width, setWidth] = useState('auto');
  const [height, setHeight] = useState('auto');
  const [error, setError] = useState(''); 
  const [fileValid, setFileValid] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (2MB = 2 * 1024 * 1024 bytes) and type
      const validationError = uploadFile2mbErrorHndlr(
        selectedFile.size, 
        selectedFile.type, 
        ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] 
      );
      
      setError(validationError);
      
      if (validationError === "") {
        setFile(selectedFile);
        setFileValid(true);
      } else {
        setFile(null);
        setFileValid(false);
      }
    } else {
      setFile(null);
      setFileValid(false);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file || !fileValid) return;
    
    try {
      const base64 = await resizeImageToBase64(file, +width, +height);
      onSubmit({ src: base64, alt, width, height });
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error processing image. Please try again.');
    }
  };

  return (
    <div className="tw-p-4">
      <div className='row'>
        <div className='col-12'>
          <BrowseFile
            containerClassName="mb-3"
            labelText="Upload File"
            labelClass="required"
            name="file"
            fileName={file?.name}
            onChangeFileHndlr={handleFileChange}
            invalid={!!error} // Show invalid state if there's an error
            error={error} // Display error message
          />
        </div>
        <div className='col-12'>
          <TextInput
            name='alt'
            value={alt}
            labelText='Alternative text'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlt(e.target.value)}
          />
        </div>
        <div className='col-6'>
          <TextInput
            name='width'
            value={width}
            labelText='Width'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)}
          />
        </div>
        <div className='col-6'>
          <TextInput
            name='height'
            value={height}
            labelText='Height'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
          />
        </div>
      </div>

      <div className="">
        <div className="hstack gap-2 justify-content-end">
          <button
            type="button"
            className={"btn btn-light"}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`btn btn-success`}
            onClick={handleSubmit}
            disabled={!fileValid || !file} // Disable submit if file is invalid or not selected
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Rest of the component remains the same...
const TipTapImageExtension = ({ editor, toolbarButtonSizing, classStyles, isStaticOptionsRequired }: { editor: Editor | null, toolbarButtonSizing: React.CSSProperties, classStyles?: string, isStaticOptionsRequired?: boolean }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { closeModal, modalState, openModal } = useModal()

  const insertImage = (data: {
    src: string;
    alt: string;
    width: string;
    height: string;
  }) => {
    editor?.chain().focus().setImage({
      src: data.src,
      alt: data.alt,
      title: data.alt,
    }).run();
  };
  
  return (
    <>
      <button
        ref={btnRef}
        id="image-tooltip"
        data-tooltip-id="image-tooltip"
        onClick={openModal}
        style={toolbarButtonSizing}
        className={classnames(`btn ${isStaticOptionsRequired ? "btn-outline-light !tw-text-black" : "btn-outline-primary tw-text-black"} btn-sm tw-relative`, { 'active': editor?.isActive('image') }, classStyles)}
      >
        <HugeiconsIcon icon={Image02Icon} className="tw-pointer-events-none" />
      </button>
      <CustomTooltip id="image-tooltip" content="Image" />

      <ModalContainerUpdated
        id="add-health-form-modal"
        isOpen={modalState.showModal}
        toggle={closeModal}
        modalTitle="Insert Image"
        modalSize="md"
      >
        <ImageInsertModal onClose={closeModal} onSubmit={insertImage} />
      </ModalContainerUpdated>
    </>
  )
}

export default TipTapImageExtension
