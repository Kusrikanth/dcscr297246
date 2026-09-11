import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  PlayCircle02Icon,
  PlayIcon,
} from "@hugeicons-pro/core-stroke-standard";
import ReactPlayer from "react-player";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaAirplayButton,
  MediaPipButton,
} from "media-chrome/react";
import VideoComponent from "./VideoComponent";

const courseModules = [
  {
    id: 1,
    title: "Real Numbers",
    videos: [
      {
        id: "c1v1",
        title: "Introduction to Real Numbers",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoDuration: 480,
        hasCompleted: false,
        transcript: "real-numbers-intro.txt",
        thumbnail: "real-numbers-intro.jpg",
      },
      {
        id: "c1v2",
        title: "Euclid's Division Lemma",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoDuration: 540,
        hasCompleted: false,
        transcript: "euclids-division.txt",
        thumbnail: "euclids-division.jpg",
      },
    ],
  },
  {
    id: 2,
    title: "Polynomials",
    videos: [
      {
        id: "c2v1",
        title: "Introduction to Polynomials",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoDuration: 510,
        hasCompleted: false,
        transcript: "polynomials-intro.txt",
        thumbnail: "polynomials-intro.jpg",
      },
      {
        id: "c2v2",
        title: "Zeros of a Polynomial",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoDuration: 600,
        hasCompleted: false,
        transcript: "polynomials-zeros.txt",
        thumbnail: "polynomials-zeros.jpg",
      },
    ],
  },
  {
    id: 3,
    title: "Trigonometry",
    videos: [
      {
        id: "c3v1",
        title: "Basics of Trigonometry",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoDuration: 520,
        hasCompleted: false,
        transcript: "trigonometry-basics.txt",
        thumbnail: "trigonometry-basics.jpg",
      },
      {
        id: "c3v2",
        title: "Trigonometric Ratios",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        videoDuration: 570,
        hasCompleted: false,
        transcript: "trigonometry-ratios.txt",
        thumbnail: "trigonometry-ratios.jpg",
      },
      {
        id: "c3v3",
        title: "Applications of Trigonometry",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        videoDuration: 630,
        hasCompleted: false,
        transcript: "trigonometry-applications.txt",
        thumbnail: "trigonometry-applications.jpg",
      },
    ],
  },
];

const ModuleItem = ({
  module,
  expandedModuleId,
  moduleIndex,
  currentVideo,
  onExpandedModuleId,
  onCurrentVideo,
}) => {
  const isExpanded = expandedModuleId === module.id;
  const totalModuleDuration = module.videos.reduce(
    (acc, cur) => acc + cur.videoDuration,
    0
  );

  const minutes = Math.floor(totalModuleDuration / 60);
  const seconds = totalModuleDuration % 60;
  const formattedDuration =
    seconds === 0 ? `${minutes} mins` : `${minutes} mins : ${seconds} sec`;

  return (
    <React.Fragment>
      <div
        onClick={() => onExpandedModuleId(module.id)}
        className={classnames(
          "tw-mb-0 tw-px-2 tw-py-1.5 tw-rounded tw-cursor-pointer tw-flex tw-justify-between tw-items-center hover:tw-bg-[#ccc] hover:tw-text-gray-900 hover:tw-font-semibold",
          {
            "tw-bg-[#ccc] tw-mb-2 tw-text-gray-900 tw-font-semibold":
              isExpanded,
          }
        )}
      >
        <div className="tw-me-2 tw-min-w-0 tw-flex-1">
          <div className="tw-truncate">{`${moduleIndex + 1}. ${module.title
            }`}</div>
          <div
            className={classnames(
              "tw-text-gray-500 tw-text-xs tw-ps-4 tw-flex tw-items-center tw-gap-1",
              { "tw-hidden": isExpanded }
            )}
          >
            <span>{`0 / ${module.videos.length}`}</span>
            <span>|</span>
            <span>{`${formattedDuration}`}</span>
          </div>
        </div>
        <div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            className={classnames("tw-flex-shrink-0", {
              "tw-transform tw-rotate-[90deg]": isExpanded,
            })}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="tw-flex tw-flex-col tw-gap-y-1 tw-mb-1">
          {module.videos.map((video, videoIndex) => (
            <div
              key={video.id}
              onClick={() => onCurrentVideo(module.id, video.id)}
              className={classnames(
                `tw-cursor-pointer tw-ps-7 tw-py-1 tw-pe-2 tw-flex tw-items-center tw-justify-between hover:tw-text-gray-900 hover:tw-font-semibold tw-relative
                    before:tw-absolute before:tw-content-[''] before:tw-top-1/2 before:tw-h-[1.4px] before:tw-w-3 before:tw-inline-block before:tw-shrink-0 before:tw-left-[10px]
                    after:tw-absolute after:tw-content-[''] after:tw-h-[34px] after:tw-w-[1.6px] after:tw-inline-block after:tw-left-[10px]`,
                {
                  "tw-font-semibold tw-text-gray-900":
                    currentVideo.moduleId === module.id &&
                    currentVideo.videoId === video.id,
                  "tw-font-medium": !(
                    currentVideo.moduleId === module.id &&
                    currentVideo.videoId === video.id
                  ),

                  "before:tw-bg-gray-900 after:tw-bg-gray-900":
                    currentVideo.moduleId === module.id &&
                    currentVideo.videoId === video.id,
                  "before:tw-bg-gray-500 after:tw-bg-gray-500": !(
                    currentVideo.moduleId === module.id &&
                    currentVideo.videoId === video.id
                  ),
                }
              )}
            >
              <span className="tw-truncate tw-w-[86%]">{video.title}</span>

              <HugeiconsIcon
                icon={PlayCircle02Icon}
                size={18}
                className="tw-shrink-0"
              />
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

const ModuleNavList = ({
  expandedModuleId,
  setExpandedModuleId,
  currentVideo,
  setCurrentVideo,
}) => {
  function handleExpandedModuleId(moduleId) {
    setExpandedModuleId((prevId) => (prevId !== moduleId ? moduleId : null));
  }

  function handleCurrentVideo(moduleId, videoId) {
    setCurrentVideo({ moduleId, videoId });
  }

  return (
    <div className="tw-flex tw-flex-col tw-gap-[3px] tw-w-full tw-h-[70%] tw-overflow-y-scroll tw-ps-4 tw-pe-2 course-content-module-list">
      {courseModules.map((module, moduleIndex) => (
        <ModuleItem
          key={module.id}
          module={module}
          expandedModuleId={expandedModuleId}
          moduleIndex={moduleIndex}
          currentVideo={currentVideo}
          onExpandedModuleId={handleExpandedModuleId}
          onCurrentVideo={handleCurrentVideo}
        ></ModuleItem>
      ))}
    </div>
  );
};

const CourseNavSideBar = ({
  expandedModuleId,
  setExpandedModuleId,
  currentVideo,
  setCurrentVideo,
}) => {
  return (
    <div className="tw-w-[250px] tw-py-5 tw-px-0 tw-border-etw-h-screen tw-bg-[#fff] tw-border-[#2e3230] tw-text-gray-700 tw-pt-[62px]">
      <div className="tw-mb-4 tw-px-4">
        <button className="btn btn-secondary">Back to course</button>
      </div>

      <div className="tw-mb-6 tw-px-4">
        <p className="tw-text-xs tw-mb-1">Course Outline</p>
        <p className="tw-mb-0 tw-text-base tw-font-semibold">
          Work-Life Balance: Achieve Harmony and Well-being
        </p>
      </div>

      <ModuleNavList
        expandedModuleId={expandedModuleId}
        setExpandedModuleId={setExpandedModuleId}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
    </div>
  );
};

const getCurrentVideoData = (currentVideo) => {
  const module = courseModules.find((m) => m.id === currentVideo.moduleId);
  if (!module) return null;
  const video = module.videos.find((v) => v.id === currentVideo.videoId);
  if (!video) return null;
  return video;
};

const VolumeControl = () => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  let timeoutRef = React.useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowVolumeSlider(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 300); 
  };

  return (
    <div 
      className="tw-relative tw-flex tw-items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MediaMuteButton />
      <div 
        className={classnames(
          "tw-transition-all tw-duration-300 tw-ease-in-out tw-overflow-hidden",
          {
            "tw-w-full tw-opacity-100": showVolumeSlider,
            "tw-w-0 tw-opacity-0": !showVolumeSlider
          }
        )}
      >
        <MediaVolumeRange className="tw-ml-1" />
      </div>
    </div>
  );
};

const CourseManagement = () => {
  const [expandedModuleId, setExpandedModuleId] = useState(
    courseModules[0]?.id
  );
  const [currentVideo, setCurrentVideo] = useState({
    moduleId: courseModules[0]?.id,
    videoId: courseModules[0]?.videos[0]?.id,
  });
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const videoData = getCurrentVideoData(currentVideo);

  function getNextVideo(currentVideo) {
    const moduleIdx = courseModules.findIndex((m) => m.id === currentVideo.moduleId);
    if (moduleIdx === -1) return null;
    const videoIdx = courseModules[moduleIdx].videos.findIndex((v) => v.id === currentVideo.videoId);
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
  }

  const nextVideoObj = getNextVideo(currentVideo);

  function handleVideoEnd() {
    if (nextVideoObj) {
      setShowNextOverlay(true);
    }
  }

  function handlePlayNext() {
    if (nextVideoObj) {
      setCurrentVideo({
        moduleId: nextVideoObj.moduleId,
        videoId: nextVideoObj.videoId,
      });
      setShowNextOverlay(false);
      if (nextVideoObj.moduleId !== expandedModuleId) {
        setExpandedModuleId(nextVideoObj.moduleId);
      }
    }
  }

  return (
    <div className="tw-w-full tw-min-h-screen tw-flex course-management-container">
      <CourseNavSideBar
        expandedModuleId={expandedModuleId}
        setExpandedModuleId={setExpandedModuleId}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
      <VideoComponent
        courseModules={courseModules}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
    </div>
  );
};

export default CourseManagement;