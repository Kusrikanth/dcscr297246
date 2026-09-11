import React from 'react'
import avatar from "../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import PdfView from './PdfView';
import PhotosView from './PhotosView';

const classStories = [
    {
        icon: avatar,
        userName: "Maria Sandos",
        time: "2 hrs ago",
        fileName: "Lorem ipsum dolor sit,consectur adipiscing.pdf",
        storyType:'pdf'
    },
    {
        icon: avatar,
        userName: "Maria Sandos",
        time: "2 hrs ago",
        photos:[],
        storyType:'photos'
    }
]
const photos=[avatar,avatar2,avatar3,avatar4]
const ClassStories = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white fee_collection_analysis_wrap tw-rounded-xl tw-shadow-sm tw-overflow-hidden">

                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                        Class Stories
                    </h4>
                </div>

                <div className="tw-px-4 tw-py-2">

                    {classStories.map((story, index) => (
                        <div
                            key={index}
                            className="tw-border-b tw-border-gray-200 tw-py-4 last:tw-border-b-0"
                        >

                            <div className="tw-flex tw-items-center tw-mb-3">

                                <div className="tw-w-10 tw-h-10 tw-rounded-full tw-overflow-hidden tw-mr-3">
                                    <img
                                        src={story.icon}
                                        className="tw-w-full tw-h-full tw-object-cover"
                                        alt="User"
                                    />
                                </div>

                                <h5 className="tw-text-base tw-font-semibold tw-mr-3">
                                    {story.userName}
                                </h5>

                                <p className="tw-text-sm tw-text-gray-500">
                                    {story.time}
                                </p>

                            </div>

                            <div className="tw-mt-2">
                                {story.storyType === "pdf" ? (
                                    <PdfView file={{}} name={story.fileName} />
                                ) : (
                                    <PhotosView photos={photos} />
                                )}
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default ClassStories
