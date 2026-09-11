import { useEffect, useState } from "react";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";
import { AvatarGroupUpdated, Button, TextArea } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import { SentIcon } from '@hugeicons-pro/core-stroke-standard';

const initialValues = {
    comments: ""
}

const Comments = ({previewDetails}: any) => {
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const fileCommentsFormik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values) => {

        },
    });

    const [commentsList, setCommentsList] = useState([
        {
            id: 1,
            userName: "Rajesh Kumar",
            employeeImage: null,
            time: "2d ago",
            comment:
                "Please review the budget allocation for Q2 before the board meeting. I've highlighted the sections that need attention.",
            likes: 3,
            replies: [
                {
                    id: 11,
                    userName: "Priya Sharma",
                    employeeImage: null,
                    time: "2d ago",
                    comment:
                        "Reviewed. The transport section looks fine but the IT budget needs a revision — costs have gone up 15% this quarter.",
                    likes: 1,
                },
                {
                    id: 12,
                    userName: "Anita Desai",
                    employeeImage: null,
                    time: "2d ago",
                    comment:
                        "Agreed with Priya. I'll update the IT section by EOD tomorrow.",
                    likes: 2,
                },
            ],
        },
        {
            id: 2,
            userName: "Vikram Singh",
            employeeImage: null,
            time: "3d ago",
            comment:
                "The formatting on page 3 seems off in the PDF export. Can someone check if this is a template issue?",
            likes: 0,
            replies: [
                {
                    id: 21,
                    userName: "Rajesh Kumar",
                    employeeImage: null,
                    time: "3d ago",
                    comment:
                        "I'll take a look. This might be related to the margin settings in the DOCX template.",
                    likes: 1,
                },
            ],
        },
        {
            id: 3,
            userName: "Priya Sharma",
            employeeImage: null,
            time: "4d ago",
            comment:
                "Added the final approval signature. This document is ready for distribution.",
            likes: 4,
            replies: [],
        },
    ]);

    const totalComments =
        commentsList.length +
        commentsList.reduce(
            (count, item) => count + (item.replies?.length || 0),
            0
        );

    const totalReplies = commentsList.reduce(
        (count, item) => count + (item.replies?.length || 0),
        0
    );

    const addCommentHandler = () => {
        const comment = fileCommentsFormik.values.comments?.trim();
        if (!comment) return;
        const newComment = {
            id: Date.now(),
            userName: "You",
            employeeImage: null,
            time: "Just now",
            comment,
            likes: 0,
            replies: [],
        };
        setCommentsList((prev) => [newComment, ...prev]);
        fileCommentsFormik.setFieldValue("comments", "");
    };

    return (
        <div className="tw-px-4">
            <div className="tw-sticky tw-top-0 tw-z-10 tw-bg-white">
                <div className="tw-flex tw-items-center tw-gap-4 tw-px-4 tw-py-2 tw-border-b tw-border-[#E5E7EB]">
                    <div className="tw-flex-1">
                        <TextArea
                            name="comments"
                            height="50px"
                            inputClassName="tw-overflow-auto"
                            value={fileCommentsFormik.values.comments}
                            onChange={fileCommentsFormik.handleChange}
                            placeHolder="Add a comment..."
                        />
                    </div>
                    <Button
                        type="button"
                        variant="sidebarMenu"
                        onClick={addCommentHandler}
                        disabled={!fileCommentsFormik.values.comments?.trim()}
                        className={`tw-border-0 !tw-p-2 tw-rounded-lg
                            ${fileCommentsFormik.values.comments?.trim()
                                ? "!tw-bg-[#0AB39C] !tw-text-white"
                                : "!tw-bg-[#E5E7EB] !tw-text-[#9CA3AF]"
                            }`}
                    >
                        <HugeiconsIcon
                            icon={SentIcon}
                            size={16}
                            strokeWidth={1.5}
                        />
                    </Button>
                </div>
                <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-border-b tw-border-[#E5E7EB]">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <HugeiconsIcon
                            icon={Message01Icon}
                            size={18}
                            className="tw-text-[#6B7280]"
                        />
                        <span className="tw-font-semibold tw-text-[#374151]">
                            {totalComments} comments
                        </span>
                    </div>

                    <span className="tw-text-[#9CA3AF] tw-font-medium">
                        {totalReplies} replies
                    </span>
                </div>
            </div>
            {commentsList.map((item) => (
                <div key={item.id} className="tw-pb-3 tw-pt-4 tw-border-b tw-border-[#E5E7EB]">
                    <div className="tw-flex tw-gap-3">
                        <AvatarGroupUpdated
                            avatars={[
                                {
                                    empId: item.id,
                                    empName: item.userName,
                                    employeeImage: item.employeeImage,
                                },
                            ]}
                            imageKey="employeeImage"
                            tooltipKey="empName"
                            numberOfAvatarToShow={1}
                            showLimitedAvatar={true}
                            showAvatarName={true}
                            uniqueAvatarKey="empId"
                        />
                        <div className="tw-flex-1">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <span className="tw-font-semibold tw-text-[#374151]">
                                    {item.userName}
                                </span>
                                <span className="tw-text-[#9CA3AF] tw-text-sm">
                                    {item.time}
                                </span>
                            </div>
                            <div className="tw-mt-1 tw-text-[#4B5563] tw-text-[15px]">
                                {item.comment}
                            </div>
                            <div className="tw-flex tw-items-center tw-gap-4 tw-mt-2 tw-text-[#9CA3AF] tw-text-sm">
                                <Button
                                    type="button"
                                    variant="sidebarMenu"
                                    className="tw-border-0 tw-bg-transparent tw-p-0 tw-text-[14px] tw-font-semibold tw-text-[#9CA3AF]"
                                >
                                    👍 {item.likes}
                                </Button>
                                <Button
                                    type="button"
                                    variant="sidebarMenu"
                                    onClick={() => {
                                        const isOpening = replyingTo !== item.id;

                                        setReplyingTo(isOpening ? item.id : null);
                                        setReplyText("");

                                        if (isOpening) {
                                            setTimeout(() => {
                                                const textarea = document.querySelector(
                                                    'textarea[name="replyText"]'
                                                ) as HTMLTextAreaElement;

                                                textarea?.focus();
                                            }, 200);
                                        }
                                    }}
                                    className="tw-border-0 tw-bg-transparent tw-p-0 tw-text-[14px] tw-font-semibold tw-text-[#9CA3AF]"
                                >
                                    ↩ Reply
                                </Button>
                            </div>
                            {replyingTo === item.id && (
                                <div className="tw-mt-3 tw-flex tw-items-center tw-gap-3">
                                    <div className="tw-flex-1">
                                        <TextArea
                                            name="replyText"
                                            height="60px"
                                            value={replyText}
                                            placeHolder={`Reply to ${item.userName}...`}
                                            onChange={(e: any) => setReplyText(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="sidebarMenu"
                                        disabled={!replyText.trim()}
                                        onClick={() => {
                                            const newReply = {
                                                id: Date.now(),
                                                userName: "You",
                                                employeeImage: null,
                                                time: "Just now",
                                                comment: replyText,
                                                likes: 0,
                                            };

                                            setCommentsList((prev: any) =>
                                                prev.map((comment: any) =>
                                                    comment.id === item.id
                                                        ? {
                                                            ...comment,
                                                            replies: [...(comment.replies || []), newReply],
                                                        }
                                                        : comment
                                                )
                                            );

                                            setReplyText("");
                                            setReplyingTo(null);
                                        }}
                                        className={`tw-border-0 !tw-p-2 tw-rounded-lg
                                            ${replyText.trim()
                                                ? "!tw-bg-[#0AB39C] !tw-text-white"
                                                : "!tw-bg-[#E5E7EB] !tw-text-[#9CA3AF]"
                                            }`}
                                    >
                                        <HugeiconsIcon
                                            icon={SentIcon}
                                            size={16}
                                            strokeWidth={1.5}
                                        />
                                    </Button>
                                </div>
                            )}
                            {item.replies?.length > 0 && (
                                <div className="tw-mt-4 tw-ml-[0px] tw-pl-6 tw-border-l tw-border-[#E5E7EB]">
                                    {item.replies.map((reply) => (
                                        <div key={reply.id} className="tw-flex tw-gap-3 tw-mb-6">
                                            <AvatarGroupUpdated
                                                avatars={[
                                                    {
                                                        empId: reply.id,
                                                        empName: reply.userName,
                                                        employeeImage: reply.employeeImage,
                                                    },
                                                ]}
                                                imageKey="employeeImage"
                                                tooltipKey="empName"
                                                numberOfAvatarToShow={1}
                                                showLimitedAvatar={true}
                                                showAvatarName={true}
                                                uniqueAvatarKey="empId"
                                            />
                                            <div>
                                                <div className="tw-flex tw-items-center tw-gap-2">
                                                    <span className="tw-font-semibold tw-text-[#374151]">
                                                        {reply.userName}
                                                    </span>
                                                    <span className="tw-text-[#9CA3AF] tw-text-sm">
                                                        {reply.time}
                                                    </span>
                                                </div>
                                                <div className="tw-mt-1 tw-text-[#4B5563]">
                                                    {reply.comment}
                                                </div>
                                                <div className="tw-mt-2 tw-text-[#9CA3AF] tw-text-sm">
                                                    👍 {reply.likes}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comments