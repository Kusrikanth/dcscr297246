import React, { useState } from 'react'
import ModifiedHorizontalTab from '../../../../Components/Common/ModifiedHorizontalTab';
import { MenuOptions } from './helper';
import BasicInfo from './BasicInfo';
import SocialMedia from './SocialMedia';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';

const OrganizationDetails = () => {
    const [menuId, setMenuId] = useState("BASICINFO");
    const [edit, setEdit] = useState(false);

    const handleEditClick = () => {
        setEdit(true);
      };


  return (
    <div className='card'>
        <div className="tw-flex tw-justify-between tw-gap-3 tw-items-center">
            <div className="tw-flex tw-flex-wrap tw-flex-grow">
            <ModifiedHorizontalTab
                MenuOptions={MenuOptions}
                getActiveMenuId={(menuId: any) => {
                    setMenuId(menuId);
                    setEdit(false);
                }}
                activeTabId={menuId}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto tw-w-full"
                labelClass="tw-whitespace-nowrap"
            />
            </div>
            
            {!edit &&<button className="tw-flex tw-gap-2 tw-items-center tw-w-auto tw-border-2 tw-p-2 tw-rounded tw-mr-2 tw-bg-transparent"  onClick={()=>handleEditClick()}>
            <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />            
                 <p className="tw-m-0">Edit</p>
            </button>}
        </div>
        <div>
            {menuId === "BASICINFO" &&  <BasicInfo edit={edit} setEdit={setEdit}/>}
            {menuId === "SOCIALMEDIA" && <SocialMedia edit={edit} setEdit={setEdit}/>}       
        </div>
    </div>
  
  )
}

export default OrganizationDetails