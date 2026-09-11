import React, { useRef, useState } from 'react';
import { Editor } from "@tiptap/react";
import { useModal } from '../../hooks/modalhook';
import classnames from "classnames";
import { HugeiconsIcon } from '@hugeicons/react';
import { VideoReplayIcon } from '@hugeicons-pro/core-stroke-standard';
import { ModalContainerUpdated } from './ModalContainer';
import {Button, CustomTooltip} from './index';

/**
 * NEW: Converts various YouTube URL formats to a standard embeddable URL.
 * This function detects standard YouTube watch links, shortened links, and shorts,
 * and transforms them into the correct format for embedding in an iframe.
 */
const convertToEmbedUrl = (url: string): string => {
    // Regex to capture the video ID from youtube.com and youtu.be URLs
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
};
 
const isDirectVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
};
 
const VideoPreview = ({ url }: { url: string }) => {
    if (!url) return null;

    const useVideoTag = isDirectVideo(url);
    const previewWrapperStyles: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        backgroundColor: '#f8f9fa',
        paddingBottom: '56.25%',
        height: 0,
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid #e9ebec'
    };
    const mediaStyles: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
    };

    if (useVideoTag) {
        return (
            <div style={previewWrapperStyles}>
                <video style={mediaStyles} controls src={url}>
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return (
        <div style={previewWrapperStyles}>
            <iframe
                style={mediaStyles}
                src={url}
                title="Video Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};
 
export const VideoInsertModal = ({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (data: { src: string }) => void;
}) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = () => {
    if (videoUrl) {
      // Convert the URL to an embeddable format before submitting
      const embedUrl = convertToEmbedUrl(videoUrl.trim());
      onSubmit({ src: embedUrl });
      onClose();
    } else {
      alert('Please enter a URL.');
    }
  };

  // Generate the preview URL by converting the user's input in real-time
  const previewUrl = videoUrl ? convertToEmbedUrl(videoUrl.trim()) : '';

  return (
    <div className="tw-p-4">
      <div className="tw-mb-3">
        <label htmlFor="video-url-input" className="form-label required">Video URL</label>
        <input
          type="url"
          id="video-url-input"
          className="form-control"
          name="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste a YouTube link or a direct video URL (e.g., .mp4)"
        />
      </div>

      {videoUrl && (
        <div className='tw-mt-4'>
          <label className="form-label">Preview</label>
          <VideoPreview url={previewUrl} />
        </div>
      )}

      <div className="tw-mt-4">
        <div className="tw-flex tw-items-center tw-justify-end tw-gap-2">
          <Button
            type="button"
            variant='secondary'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant='primary'
            onClick={handleSubmit}
            disabled={!videoUrl.trim()}
          >
            Add to Editor
          </Button>
        </div>
      </div>
    </div>
  );
};
 
const TipTapVideoExtension = ({ editor, toolbarButtonSizing, classStyles, isStaticOptionsRequired }: { editor: Editor | null, toolbarButtonSizing: React.CSSProperties, classStyles?: string, isStaticOptionsRequired?: boolean }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { closeModal, modalState, openModal } = useModal();

  const insertVideo = (data: { src: string }) => {
    if (data.src && editor) {
      (editor.chain().focus() as any).setIframe({ src: data.src }).run();
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        id="video-tooltip"
        data-tooltip-id="video-tooltip"
        onClick={openModal}
        style={toolbarButtonSizing}
        className={classnames(`btn ${isStaticOptionsRequired ? "btn-outline-light !tw-text-black" : "btn-outline-primary tw-text-black"} btn-sm tw-relative`, { 'active': editor?.isActive('iframe') }, classStyles)}
      >
        <HugeiconsIcon icon={VideoReplayIcon} className="tw-pointer-events-none" />
      </button>
      <CustomTooltip id="video-tooltip" content="Video" />

      <ModalContainerUpdated
        id="insert-video-modal"
        isOpen={modalState.showModal}
        toggle={closeModal}
        modalTitle="Insert video from URL"
        modalSize="md"
      >
        <VideoInsertModal onClose={closeModal} onSubmit={insertVideo} />
      </ModalContainerUpdated>
    </>
  );
};

export default TipTapVideoExtension;