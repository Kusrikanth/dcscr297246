import React, { useEffect, useState } from "react";
import { DateInput, SelectInput, TextArea, TextInput } from "../../../../Components/Common";
import "./progress.scss";
import CommunicateMail from "./CommunicateSlider/CommunicateMail";
import CommunicatePhone from "./CommunicateSlider/CommunicatePhone";
import CommunicateWhatsApp from "./CommunicateSlider/CommunicateWhatsApp";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, SmartPhone01Icon, WhatsappIcon } from "@hugeicons-pro/core-stroke-standard";


export default function CommunicateModel(props: any) {
    const [activeTab, setActiveTab] = useState(Mail01Icon);

    const handleTabClick = (tabName: any) => {
        setActiveTab(tabName);
      };
    return (
        <React.Fragment>
            <div className="tw-flex tw-gap-3 tw-border-b tw-border-t tw-items-center tw-mt-3 tw-px-2">

                {[Mail01Icon, SmartPhone01Icon, WhatsappIcon ].map((tab, index) => (
                    <div
                        key={index}
                        className={` tw-p-2 tw-w-10 tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-fs-3 ${activeTab === tab ? ' tw-text-white tw-bg-blue-600  ' : ''}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        <i className={`${tab}`}></i>
                        <HugeiconsIcon icon={tab} size={25} />
                    </div>
                ))}
            </div>
          
                <div>
                    {activeTab === Mail01Icon && <CommunicateMail />}
                    {activeTab === SmartPhone01Icon && <CommunicatePhone />}
                    {activeTab === WhatsappIcon && <CommunicateWhatsApp />}
                   
                </div>
            
           
        </React.Fragment>

    )
}