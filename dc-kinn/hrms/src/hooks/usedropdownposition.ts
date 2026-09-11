'use client';

import { useLayoutEffect, useState } from "react";

export default function useDropdownPosition(menuBtnRef: any, menuDivRef: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [transformOrigin, setTransformOrigin] = useState('');
    const [menuPositionState, setMenuPositionState] = useState<any>(null);
    function updateDropdownMenuHndlr() {
        if (menuBtnRef.current) {
            const positionData = menuBtnRef.current.getBoundingClientRect(),
                windowHeight = window.innerHeight, { top } = positionData || {};
            if (top && menuDivRef?.current) {
                const topDistance = Math.floor(top);
                const dropdownWidth = menuDivRef?.current.offsetWidth,
                    dropdownHeight = menuDivRef?.current.offsetHeight;
                if ((Number(windowHeight) - (Number(topDistance) + Number(positionData.height))) > dropdownHeight) {
                    setMenuPositionState({
                        minWidth: positionData.width,
                        left: Number(positionData.x) + Number(window.scrollX),
                        top: Number(positionData.y) + Number(positionData.height) + Number(window.scrollY) + 3,
                    })
                    setTransformOrigin('top left');
                } else {
                    setMenuPositionState({
                        minWidth: positionData.width,
                        left: Number(positionData.x) + Number(window.scrollX),
                        top: Number(positionData.y) + Number(window.scrollY) - Number(dropdownHeight) - 3,
                    })
                    setTransformOrigin('bottom left');
                }
            }
        }
    }

    useLayoutEffect(() => {
        function hideMenuOptions(event: any) {
            if ((menuBtnRef.current && !menuBtnRef.current.contains(event.target))
                && (menuDivRef.current && !menuDivRef.current.contains(event.target))) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", hideMenuOptions);
        updateDropdownMenuHndlr();
        return () => {
            document.removeEventListener("mousedown", hideMenuOptions);
        };
    }, [setIsOpen]);

    useLayoutEffect(() => {
        function scrollEventHndlr() {
            updateDropdownMenuHndlr();
        }
        if (isOpen) {
            updateDropdownMenuHndlr();
            window.addEventListener("scroll", scrollEventHndlr);
        } else {
            window.removeEventListener("scroll", scrollEventHndlr);
        }
        return () => {
            window.removeEventListener("scroll", scrollEventHndlr);
        };
    }, [isOpen]);

    return { isOpen, setIsOpen, transformOrigin, menuPositionState };
}
