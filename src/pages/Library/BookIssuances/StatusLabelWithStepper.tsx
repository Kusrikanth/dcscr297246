import { useState } from "react";
// import PopOver from "./PopOver";
import { shallowEqual, useDispatch } from "react-redux";
import PopOver from "./PopOver";
import { default as IButton } from "../../../assets/imagesdps/I_Button_svg.svg?react";

interface IStatusLabel {
    id: string,
    index: number,
    type: string,
    labelName: string,
    data: any;
}

export const StatusLabelWithStepper = ({ id, index, type, labelName, data }: IStatusLabel) => {
    const dispatch = useDispatch();

    const [popOver, setPopOver] = useState(false);

    // const [openPopOver, setOpenPopOver] = useState<>([]);

    const toggle = (event: any) => {
        event.preventDefault();
        // const id=event.currentTarget.getAttribute('data-id');

        if (event.type === "blur") {
            setPopOver(false);
        }
        else {
            //   dispatch(getTcReqLogRes(generateActionPayload('get_tc_req_log',{tcRequestId:id})))
            setPopOver(prev => !prev);
        }
    }

    const statusClassMap: any = {
        renewal: "tw-bg-[#f7b84b1a] tw-text-[#f7b84b]",
        issued: "tw-bg-[#008ed31a] tw-text-[#008ed3]",
        returned: "tw-bg-[#0ab39c1a] tw-text-[#0ab39c]",
        default: "tw-bg-[#f7b84b1a] tw-text-[#f7b84b]",
    };

    const statusClass =
        statusClassMap[type.toLowerCase()] || statusClassMap.default;

    switch (type.toLowerCase()) {
        case "renewal":
        case "issued":
        case "returned":
        default:
            return (
                <div className="tw-flex tw-items-center">
                    <button
                        data-id={index}
                        id={`testing-${index}`}
                        className={`tw-uppercase tw-text-xs tw-font-semibold tw-px-3 tw-py-1 tw-rounded-md tw-me-2 ${statusClass}`}
                    >
                        {labelName}
                    </button>
                    <button
                        className="tw-bg-transparent tw-border-none"
                        onClick={toggle}
                        onBlur={toggle}
                    >
                        <IButton className="tw-cursor-pointer" id={`testing-${index}`} />
                    </button>
                    <PopOver data={data} popOver={popOver} index={index} />
                </div>);
    }
}