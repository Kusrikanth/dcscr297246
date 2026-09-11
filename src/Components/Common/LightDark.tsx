import React from 'react';

//constants
import { layoutModeTypes } from "../constants/layout";

interface ILightDarkProps {
    layoutMode: string,
    onChangeLayoutMode: (mode: string) => {}
}

const LightDark = ({ layoutMode, onChangeLayoutMode }: ILightDarkProps) => {

    const mode = layoutMode === layoutModeTypes['DARKMODE'] ? layoutModeTypes['LIGHTMODE'] : layoutModeTypes['DARKMODE'];

    function changeLayoutHandler() {
        onChangeLayoutMode(mode);
    }
    return (
        <div className="tw-ms-1 header-item tw-hidden sm:tw-flex">
            <button
                onClick={changeLayoutHandler}
                type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
                <i className='bx bx-moon fs-22'></i>
            </button>
        </div>
    );
};

export default LightDark;