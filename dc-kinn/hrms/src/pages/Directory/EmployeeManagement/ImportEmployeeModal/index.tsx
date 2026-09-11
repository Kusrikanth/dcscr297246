import React, { useState, useMemo } from "react";
import {
    HorizontalWizard
} from "../../../../Components/Common";

//Helper
import { stepInfo } from "./helper";

//Component
import MapColumns from "./MapColumns";
import UploadStudent from "./UploadStudent";
import PreviewUpload from "./PreviewUpload";

function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case "upload_file":
            return UploadStudent;
        case "map_columns":
            return MapColumns;
        case "preview":
            return PreviewUpload;
        default:
            return null;

    }
}

export default function ImportStudentModal() {
    const [activeStepId, setActiveStepId] = useState("upload_file");

    function updateStepHndlr(stepId: any) {
        setActiveStepId(stepId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeStepId);
        if (TabComponent)
            return <TabComponent />
    }, [activeStepId]);

    return (
        <React.Fragment>
            <HorizontalWizard
                updateStepHndlr={updateStepHndlr}
                stepsList={stepInfo}
                activeStepId={activeStepId}
                containerClass="tw-px-4 tw-py-3 tw-mb-2"
            />
            {activeComponent}
        </React.Fragment>
    )
}