import React from 'react';
import DefaultStudentImage from "../../assets/imagesdps/student-default-img.png";
import indexnew from '../../Layouts/VerticalLayouts/indexnew';

interface AvatarGroupPropType {
    avatars: any;
    showLimitedAvatar?: any;
    numberOfAvatarToShow?: any;
    MoreAvatars?: any
}

export const AvatarGroup = (props: AvatarGroupPropType) => {

    return (
        <div className="avatar-group">
            {
                props.avatars && props.avatars.slice(0, props.showLimitedAvatar ? +props.numberOfAvatarToShow : +props.avatars.length).map((avatar: any, index: any) => {
                    return <>
                        <div className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title={avatar.name} key={index}>
                            <img src={avatar?.img || DefaultStudentImage} alt="" className="rounded-circle avatar-xs" />
                        </div>
                    </>

                })
            }
            {
                props.showLimitedAvatar && +props.avatars.length > +props.numberOfAvatarToShow && <div className="avatar-group-item cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="more" onClick={props.MoreAvatars}>
                    <div className="avatar-xs">
                        <div className="avatar-title rounded-circle" style={{ backgroundColor: "#D4F5F0", color: "#0AB39C" }}>
                            {+props.avatars.length - +props.numberOfAvatarToShow + "+"}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

interface AvatarGroupPropType {
    avatars: any;
    showLimitedAvatar?: any;
    numberOfAvatarToShow?: any;
    imageKey?: string;
    tooltipKey?: string;
    dataId?: string;
    uniqueAvatarKey: string;
    showAvatarName?:boolean;
    onClickHandler?: any;
    onClickMoreAvatarHndlr?: any;
}

const bgColor = ["#3366FF","#F7C537","#A5A7FE"]
export const AvatarGroupUpdated = (props: AvatarGroupPropType) => {
    const imageKey = props?.imageKey || "";
    const tooltipKey = props?.tooltipKey || "";
    return (
        <div className="avatar-group">
            {
                Array.isArray(props.avatars) && props.avatars.slice(0, props.showLimitedAvatar ? +props.numberOfAvatarToShow : +props.avatars.length).map((avatar: any, index: any) => {
                    const imageUrl = imageKey ? avatar[imageKey] : avatar?.img;
                    return <React.Fragment key={avatar[props.uniqueAvatarKey]}>
                        <div data-id={avatar?.studentRegId || avatar?.studentRegistrationId} className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title={avatar?.name||avatar?.studentName || avatar[tooltipKey]} key={index} onClick={props.onClickHandler}>
                           { props.showAvatarName ?  <div style={{background:`${bgColor[index]}`}} className="rounded-circle avatar-xs d-flex justify-content-center align-items-center avatar-grp-fname">
                                {avatar[tooltipKey]?.slice(0, 1)?.toUpperCase()}
                            </div> : <img src={imageUrl || DefaultStudentImage} alt="" className="rounded-circle avatar-xs" />}
                        </div>
                    </React.Fragment>

                })
            }
            {
                props.showLimitedAvatar && +props.avatars.length > +props.numberOfAvatarToShow &&
                <div data-id={props.dataId} className="avatar-group-item cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="more" onClick={props.onClickMoreAvatarHndlr}>
                    <div className="avatar-xs">
                        <div className="avatar-title rounded-circle" style={{ backgroundColor: "#D4F5F0", color: "#0AB39C" }}>
                            {+props.avatars.length - +props.numberOfAvatarToShow + "+"}
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

