import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css';
import { FileTypeIcon } from './FilceIconType';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { Button } from '../../../../Components/Common';

export interface ISuggestedFile {
    id: number;
    fileName: string;
    uploadedBy?: string;
    uploadedOn?: string;
    extension?: string;
    folderId?: number | string;
    path?: string;
    size?: string;
}

interface SuggestedFilesSwiperProps {
    files: ISuggestedFile[];
    onFileClick: (file: ISuggestedFile) => void;
    onSwiperMove?: () => void;
    emptyMessage?: string;
}

const SuggestedFilesSwiper = ({ files, onFileClick, onSwiperMove, emptyMessage = 'No recent files found' }: SuggestedFilesSwiperProps) => {
    const swiperRef = useRef<SwiperType | null>(null);

    const [activeFileId, setActiveFileId] = useState<number | null>(null);

    useEffect(() => {
        if (!files.length) {
            setActiveFileId(null);
            return;
        }
        setActiveFileId(files[0].id);
    }, [files]);

    const updateActiveFile = (swiper: SwiperType) => {
        const item = files[swiper.realIndex];
        if (item) {
            setActiveFileId(item.id);
        }
    };

    const handleSwiperMove = () => {
        onSwiperMove?.();
    };

    const handlePrevious = () => {
        swiperRef.current?.slidePrev();
    };

    const handleNext = () => {
        swiperRef.current?.slideNext();
    };

    if (!files.length) {
        return (
            <div className="tw-flex tw-h-[150px] tw-items-center tw-justify-center tw-text-sm tw-text-slate-400">
                {emptyMessage}
            </div>
        );
    }

    const hasEnoughFiles = files.length > 4;

    return (
        <div className={`tw-relative tw-w-full ${hasEnoughFiles ? 'tw-px-12' : 'tw-px-4'
            }`}>
            {hasEnoughFiles && (
                <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={handlePrevious}
                    aria-label="Previous files"
                    className="
            !tw-absolute
            !tw-left-1
            !tw-top-1/2
            !tw-z-20
            !tw-flex
            !tw-h-8
            !tw-w-8
            !tw--translate-y-1/2
            !tw-items-center
            !tw-justify-center
            !tw-rounded-full
            !tw-border-2
            !tw-border-slate-100
            !tw-bg-white
            !tw-text-slate-600
            !tw-shadow-sm
        "
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={17} />
                </Button>
            )}
            <Swiper
                className="!tw-py-2 mySwiper swiper tw-rounded-2xl fade-overlay-swiper"
                grabCursor={hasEnoughFiles}
                centeredSlides={hasEnoughFiles}
                slidesPerView={4}
                loop={files.length > 4}
                allowTouchMove={hasEnoughFiles}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    updateActiveFile(swiper);
                }}
                onSliderMove={handleSwiperMove}
                onTransitionStart={handleSwiperMove}
                onSlideChange={(swiper) => {
                    handleSwiperMove();
                    updateActiveFile(swiper);
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                    },
                    480: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    1400: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    },
                }}
            >
                {files.map((item) => (
                    <SwiperSlide className={`${hasEnoughFiles ? 'tw-px-0' : 'tw-px-1'
                        }`} key={item.id}>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => onFileClick(item)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault();
                                    onFileClick(item);
                                }
                            }}
                            className={`
                                tw-rounded-xl
                                tw-p-4
                                tw-flex
                                tw-items-center
                                tw-gap-4
                                tw-h-full
                                tw-bg-white
                                tw-border
                                tw-border-slate-200
                                tw-transition-all
                                tw-duration-300
                                tw-cursor-pointer
                                hover:tw-border-indigo-300
                                focus:tw-outline-none
                                focus:tw-ring-2
                                focus:tw-ring-indigo-300
                                ${activeFileId === item.id
                                    ? 'tw-scale-[1.02] tw-opacity-100 tw-shadow-md tw-z-10'
                                    : 'tw-scale-[0.98] tw-opacity-80'
                                }
                            `}
                        >
                            <div className="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-slate-50 tw-border tw-border-slate-100 tw-flex tw-items-center tw-justify-center tw-shrink-0">
                                <FileTypeIcon
                                    extension={item.extension}
                                    fileName={item.fileName}
                                    isFolder={false}
                                    size={20}
                                />
                            </div>

                            <div className="tw-min-w-0 tw-flex-1">
                                <h5
                                    className={`tw-mb-1 tw-text-[14px] tw-font-bold tw-truncate ${activeFileId === item.id
                                        ? 'tw-text-slate-600'
                                        : 'tw-text-slate-500'
                                        }`}
                                >
                                    {item.fileName}
                                </h5>

                                <p className="tw-mb-1 tw-text-[11px] tw-font-medium tw-text-slate-400 tw-truncate">
                                    {item.path || '-'}
                                </p>

                                <p className="tw-mb-0 tw-text-[11px] tw-font-medium tw-text-slate-400 tw-truncate">
                                    {item.uploadedBy || '-'}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {hasEnoughFiles && (
                <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={handleNext}
                    aria-label="Next files"
                    className="
                            !tw-absolute
                            !tw-right-[0px]
                            !tw-top-1/2
                            !tw-z-20
                            !tw-flex
                            !tw-h-8
                            !tw-w-8
                            !tw-border-2
                            !tw-border-slate-100
                            !tw--translate-y-1/2
                            !tw-items-center
                            !tw-justify-center
                            !tw-rounded-full
                            !tw-bg-white
                            !tw-text-slate-600
                            !tw-shadow-sm
                            hover:!tw-bg-slate-50
                            hover:!tw-shadow-md
                        "
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
                </Button>
            )}
        </div>
    );
};

export default SuggestedFilesSwiper;