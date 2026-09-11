import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaFullscreenButton,
    MediaPipButton,
    MediaMuteButton,
} from "media-chrome/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon } from "@hugeicons-pro/core-stroke-standard";

interface Video {
    id: string;
    title: string;
    url: string;
    videoDuration: number;
    hasCompleted: boolean;
    transcript: string;
    thumbnail: string;
}

interface CourseModule {
    id: number;
    title: string;
    videos: Video[];
}

interface VideoComponentProps {
    courseModules?: CourseModule[];
    expandedModuleId?: number;
    setExpandedModuleId?: (id: number | null) => void;
    currentVideo?: { moduleId: number; videoId: string };
    setCurrentVideo?: (video: { moduleId: number; videoId: string }) => void;
    showTitle?: boolean;
    defaultVideo?: Video;
    width?: string | number;
    height?: string | number;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
    courseModules = [],
    expandedModuleId,
    setExpandedModuleId,
    currentVideo,
    setCurrentVideo,
    showTitle = true,
    defaultVideo,
    width = "100%",
    height = "auto",
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const videoData =
        (currentVideo && courseModules.length > 0
            ? courseModules
                .find((m) => m.id === currentVideo.moduleId)
                ?.videos.find((v) => v.id === currentVideo.videoId)
            : null) || defaultVideo || null;
    if (!videoData) {
        return (
            <div className="tw-text-gray-500 tw-p-4">
                Select a video to play
            </div>
        );
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const getNextVideo = () => {
        if (!currentVideo || !courseModules.length) return null;
        const moduleIdx = courseModules.findIndex(
            (m) => m.id === currentVideo.moduleId
        );
        if (moduleIdx === -1) return null;
        const videoIdx = courseModules[moduleIdx].videos.findIndex(
            (v) => v.id === currentVideo.videoId
        );
        if (videoIdx === -1) return null;
        if (videoIdx < courseModules[moduleIdx].videos.length - 1) {
            return {
                moduleId: courseModules[moduleIdx].id,
                videoId: courseModules[moduleIdx].videos[videoIdx + 1].id,
                video: courseModules[moduleIdx].videos[videoIdx + 1],
            };
        }
        if (moduleIdx < courseModules.length - 1 && courseModules[moduleIdx + 1].videos.length > 0) {
            return {
                moduleId: courseModules[moduleIdx + 1].id,
                videoId: courseModules[moduleIdx + 1].videos[0].id,
                video: courseModules[moduleIdx + 1].videos[0],
            };
        }

        return null;
    };

    const nextVideoObj = getNextVideo();

    if (!videoData)
        return showTitle ? (
            <div className="tw-text-gray-500">Select a video to play</div>
        ) : null;

    return (
        <div className="tw-flex-1 tw-p-0  lg:tw-p-8 tw-bg-[#f8f9fa] tw-flex tw-flex-col tw-items-center tw-justify-start">
            {showTitle && (
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-gray-800">
                    {videoData.title}
                </h2>
            )}
            <div className="tw-relative tw-w-full" style={{ paddingTop: "56.25%" /* 16:9 */ }}>
                <MediaController className="tw-absolute tw-inset-0 tw-w-full tw-h-full">
                    <ReactPlayer
                        slot="media"
                        src={videoData.url}
                        width="100%"
                        height="100%"
                        controls={false}
                    />
                    <MediaControlBar>
                        <MediaPlayButton />
                        <MediaMuteButton />
                        <MediaVolumeRange className="tw-ml-1" />
                        <MediaTimeRange />
                        <MediaTimeDisplay remaining />
                        <MediaPlaybackRateButton />
                        <MediaPipButton />
                        <MediaFullscreenButton />
                    </MediaControlBar>
                </MediaController>
            </div>
        </div>
    );
};

export default VideoComponent;
