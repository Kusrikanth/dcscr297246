import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from "@tiptap/starter-kit";
import "katex/dist/katex.min.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from '@tiptap/extension-image';
import { ModalContainerUpdated } from ".";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, FileEditIcon, LeftToRightListBulletIcon, LeftToRightListNumberIcon, FunctionOfXIcon, PulleyIcon, TestTube01Icon, SourceCodeSquareIcon, GridTableIcon, TextIndentMoreIcon, TextIndentLessIcon, Summation01Icon, SourceCodeIcon, TextCreationIcon, RightToLeftBlockQuoteIcon, LeftToRightBlockQuoteIcon, TextAlignCenterIcon, HighlighterIcon, Undo02Icon, Redo02Icon, TextBoldIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon, InsertRowDownIcon, InsertRowUpIcon, RowDeleteIcon, InsertColumnLeftIcon, InsertColumnIcon, ColumnInsertIcon, GitMergeIcon, CellsIcon, LayoutTable01Icon, ArrowShrink02Icon, ArrowExpand01Icon, ColumnDeleteIcon, UnfoldMoreIcon, TextColorIcon, BorderAll01Icon, BorderNone02Icon, TableIcon } from "@hugeicons-pro/core-stroke-standard";
import classnames from "classnames";
import { createPortal } from 'react-dom';
import {CustomTooltip, ConfirmationModal} from './index';
import Underline from '@tiptap/extension-underline'
import { useModal } from '../../hooks/modalhook';
import {Table} from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Indent } from "./TipTapIndentExtension"
import TipTapTableExtension from "./TipTapTableExtension";
import TipTapImageExtension from "./TipTapImageExtension";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { createLowlight, common } from 'lowlight';
import { CodeBlockComponent } from './CodeBlockComponent';
import CustomTipTapEditorModal from "./CustomTipTapEditorModal";
import { Node } from '@tiptap/core';
import TipTapVideoExtension from "./TipTapVideoExtension";
import { Iframe } from "./TipTapIframeExtension";
import Math, { migrateMathStrings } from "@tiptap/extension-mathematics";
import { FormFeedback } from "reactstrap";
import { TextStyle, Color } from '@tiptap/extension-text-style';

const lowlight = createLowlight(common);

const CustomImage = Image.extend({
    addOptions() {
        return {
            // ...this.parent?.(),
            allowBase64: true,
        };
    },
    selectable: true,
    atom: false,
    draggable: true,
    inline: false,
});

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            borderColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-border-color'),
                renderHTML: attributes => {
                    const color = attributes.borderColor || '#000000';
                    const width = attributes.borderWidth || '1px';
                    if (!attributes.borderColor && !attributes.borderWidth) return {}
                    return {
                        'data-border-color': attributes.borderColor,
                        'data-border-width': attributes.borderWidth,
                        style: `border: ${width} solid ${color} !important;`
                    }
                },
            },
            borderWidth: {
                default: null,
                parseHTML: element => element.getAttribute('data-border-width'),
                renderHTML: attributes => {
                    return {}
                },
            },
        }
    },
});

const CustomTableHeader = TableHeader.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            borderColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-border-color'),
                renderHTML: attributes => {
                    const color = attributes.borderColor || '#000000';
                    const width = attributes.borderWidth || '1px';
                    if (!attributes.borderColor && !attributes.borderWidth) return {}
                    return {
                        'data-border-color': attributes.borderColor,
                        'data-border-width': attributes.borderWidth,
                        style: `border: ${width} solid ${color} !important;`
                    }
                },
            },
            borderWidth: {
                default: null,
                parseHTML: element => element.getAttribute('data-border-width'),
                renderHTML: attributes => {
                    return {}
                },
            },
        }
    },
});


const MathNodeMenu = ({ editor, setModalType, setMathContent, modalType }: { editor: any, setModalType: React.Dispatch<React.SetStateAction<"Math" | "Physics" | "Chemistry" | "OCR" | "Mathematical Notation (KaTeX)" | "Code Editor" | null>>, setMathContent: React.Dispatch<React.SetStateAction<string>>, modalType: "Math" | "Physics" | "Chemistry" | "OCR" | "Mathematical Notation (KaTeX)" | "Code Editor" | null }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editor) return;
        const updateMenu = () => {
            const { view, state } = editor;
            const { from } = state.selection;
            const node = state.selection.node;

            if (node?.type?.name === "inlineMath" || node?.type?.name === "image" || node?.type?.name === "iframe") {
                const dom = view.nodeDOM(from) as HTMLElement;
                const rect = dom?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + window.scrollY + 6,
                        left: rect.left + window.scrollX,
                    });
                    setShowMenu(true);
                }
            } else {
                setShowMenu(false);
            }
        };
        editor.on("selectionUpdate", updateMenu);
        return () => editor.off("selectionUpdate", updateMenu);
    }, [editor]);

    useEffect(() => {
        if (!showMenu) return;
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof window.Node)) {
                return;
            }

            if (menuRef.current && menuRef.current.contains(target)) return;

            const { view, state } = editor;
            const { from } = state.selection;
            const dom = view.nodeDOM(from) as HTMLElement;

            if (dom && dom.contains(target)) {
                return;
            }
            setShowMenu(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu, editor]);

    const handleEdit = () => {
        const node = editor.state.selection.node;
        const latex = node?.attrs?.latex ?? "";
        setShowMenu(false);
        editor?.commands.blur();
        editor?.chain().focus().run();
        setModalType("Math");
        setMathContent(latex);
    };

    const handleDelete = () => {
        editor.commands.deleteSelection();
        setShowMenu(false);
    };

    if (!showMenu) return null;

    return createPortal(
        <div
            ref={menuRef}
            className="tw-absolute tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-z-[1000] tw-w-32 tw-font-sans tw-overflow-hidden"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 1000,
            }}
        >
            {editor?.state?.selection?.node?.type?.name === "inlineMath" && <div
                className="tw-py-2 tw-px-4 tw-cursor-pointer tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium hover:tw-bg-gray-100"
                onClick={handleEdit}
            >
                <HugeiconsIcon icon={FileEditIcon} size={20} /> Edit
            </div>}
            <div
                className="tw-py-2 tw-px-4 tw-cursor-pointer tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-red-600 hover:tw-bg-red-50"
                onClick={handleDelete}
            >
                <HugeiconsIcon icon={Delete02Icon} size={20} /> Delete
            </div>
        </div>,
        document.body
    );
};

const TableBubbleMenu = ({ 
    editor, 
    tableBorderColor, 
    onTableBorderColorChange, 
    onUnsetTableBorderColor,
    tableBorderWidth,
    onTableBorderWidthChange,
    onUnsetTableBorderWidth
}: { 
    editor: Editor, 
    tableBorderColor: string,
    onTableBorderColorChange: (color: string) => void,
    onUnsetTableBorderColor: () => void,
    tableBorderWidth: number,
    onTableBorderWidthChange: (width: number) => void,
    onUnsetTableBorderWidth: () => void
}) => {
    const menuButtonStyles = "btn btn-light btn-sm d-flex align-items-center justify-content-center p-1";
    const { closeModal: closeDeleteTableModal, modalState: deleteTableModalState, openModal: openDeleteTableModal } = useModal();
    const { closeModal: closeDeleteColumnModal, modalState: deleteColumnModalState, openModal: openDeleteColumnModal } = useModal();
    const { closeModal: closeDeleteRowModal, modalState: deleteRowModalState, openModal: openDeleteRowModal } = useModal();

    const handleDeleteTable = () => {
        editor.chain().focus().deleteTable().run();
        closeDeleteTableModal();
    };

    const handleDeleteColumn = () => {
        editor.chain().focus().deleteColumn().run();
        closeDeleteColumnModal();
    };

    const handleDeleteRow = () => {
        editor.chain().focus().deleteRow().run();
        closeDeleteRowModal();
    };

    const findTable = useCallback(() => {
        const { selection } = editor.state;
        if (!selection?.$head) return null;

        const { $head } = selection;
        for (let i = $head.depth; i > 0; i--) {
            const node = $head.node(i);
            if (node.type.name === 'table') {
                return { node };
            }
        }
        return null;
    }, [editor.state.selection]);

    const tableInfo = findTable();
    const isMaxSize = tableInfo?.node.attrs['data-size'] === 'full';

    const handleToggleSize = useCallback(() => {
        if (!tableInfo) return;

        const newSize = isMaxSize ? 'auto' : 'full';
        const newStyle = newSize === 'full' ? 'width: 100%;' : null;

        editor.chain().focus()
            .updateAttributes('table', {
                'data-size': newSize,
                style: newStyle
            })
            .run();
    }, [editor, isMaxSize, tableInfo]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                editor.chain().focus().blur().run();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor]);

    return (
        <BubbleMenu
            editor={editor}
            options={{
                placement: 'top-start'
            }}
            shouldShow={({ editor }) => editor.isActive('table')}
            className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-xl tw-z-50 tw-flex tw-flex-wrap tw-items-center tw-p-1 tw-w-max gap-1"
        >
            {/* <button
                id="toggle-table-size-tooltip"
                data-tooltip-id="toggle-table-size-tooltip"
                onClick={handleToggleSize}
                className={menuButtonStyles}
            >
                <HugeiconsIcon icon={isMaxSize ? ArrowShrink02Icon : ArrowExpand01Icon} size={20} className="tw-pointer-events-none"/>
            </button>
            {/* <CustomTooltip id="toggle-table-size-tooltip" content={isMaxSize ? "Min size" : "Max size"} /> */}

            <button
                id="toggle-header-row-tooltip"
                data-tooltip-id="toggle-header-row-tooltip"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                disabled={!editor.can().toggleHeaderRow()}
                className={classnames(menuButtonStyles, { 'tw-bg-blue-100 !tw-text-blue-600': editor.isActive('tableHeader') })}
            >
                <HugeiconsIcon icon={LayoutTable01Icon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="toggle-header-row-tooltip" content="Toggle header row" className="tw-z-[9999]"/>

            <button
                id="delete-table-tooltip"
                data-tooltip-id="delete-table-tooltip"
                onClick={openDeleteTableModal} 
                disabled={!editor.can().deleteTable()} 
                className={classnames(menuButtonStyles, "hover:tw-bg-red-100")} 
            >
                <HugeiconsIcon icon={Delete02Icon} size={20} className="tw-pointer-events-none tw-text-red-600"/>
            </button>
            <CustomTooltip id="delete-table-tooltip" content="Delete table" className="tw-z-[9999]"/>

            <div className="tw-border-l tw-mx-1 tw-h-5"></div>
            
            <div className="tw-relative tw-inline-block">
                <input
                    type="color"
                    value={tableBorderColor}
                    onChange={(e) => onTableBorderColorChange(e.target.value)}
                    className="tw-w-8 tw-h-8 tw-border tw-border-gray-300 tw-rounded tw-cursor-pointer tw-opacity-0 tw-absolute tw-inset-0"
                    style={{ ...{ width: '30px', height: '30px', padding: 0 } as React.CSSProperties }}
                    data-tooltip-id="table-border-color-tooltip"
                />
                <button
                    data-tooltip-id="table-border-color-tooltip"
                    style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', padding: '0' }}
                    className={menuButtonStyles}
                    onClick={() => {
                        const colorInput = document.querySelector('input[type="color"][data-tooltip-id="table-border-color-tooltip"]') as HTMLInputElement;
                        colorInput?.click();
                    }}
                >
                    <HugeiconsIcon icon={BorderAll01Icon} color={tableBorderColor} size={20} className="tw-pointer-events-none"/>
                </button>
                <CustomTooltip id="table-border-color-tooltip" content="Cell Border Color" className="tw-z-[9999]"/>
            </div>

            <button
                id="unset-table-color-tooltip"
                onClick={onUnsetTableBorderColor}
                style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', padding: '0' }}
                data-tooltip-id="unset-table-color-tooltip"
                className={menuButtonStyles}
            >
                <HugeiconsIcon icon={BorderNone02Icon} size={20} className="tw-pointer-events-none" style={{ opacity: 0.5 }} />
            </button>
            <CustomTooltip id="unset-table-color-tooltip" content="Remove Border Color" className="tw-z-[9999]"/>

            <div className="tw-border-l tw-mx-1 tw-h-5"></div>

            <div className="tw-flex tw-items-center tw-gap-1">
                <button
                    id="decrease-border-width-tooltip"
                    data-tooltip-id="decrease-border-width-tooltip"
                    onClick={() => {
                        const newWidth = tableBorderWidth - 1;
                        onTableBorderWidthChange(newWidth < 1 ? 1 : newWidth);
                    }}
                    style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', padding: '0' }}
                    className={menuButtonStyles}
                    disabled={tableBorderWidth <= 1}
                >
                    <span className="tw-font-bold tw-text-lg tw-pointer-events-none">−</span>
                </button>
                <CustomTooltip id="decrease-border-width-tooltip" content="Decrease Border Width" className="tw-z-[9999]"/>

                <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableBorderWidth}
                    onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const clampedValue = value < 1 ? 1 : value > 10 ? 10 : value;
                        onTableBorderWidthChange(clampedValue);
                    }}
                    className="tw-w-12 tw-h-8 tw-text-center tw-border tw-border-gray-300 tw-rounded tw-text-sm"
                    data-tooltip-id="border-width-input-tooltip"
                />
                <CustomTooltip id="border-width-input-tooltip" content="Border Width (px)" className="tw-z-[9999]"/>

                <button
                    id="increase-border-width-tooltip"
                    data-tooltip-id="increase-border-width-tooltip"
                    onClick={() => {
                        const newWidth = tableBorderWidth + 1;
                        onTableBorderWidthChange(newWidth > 10 ? 10 : newWidth);
                    }}
                    style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', padding: '0' }}
                    className={menuButtonStyles}
                    disabled={tableBorderWidth >= 10}
                >
                    <span className="tw-font-bold tw-text-lg tw-pointer-events-none">+</span>
                </button>
                <CustomTooltip id="increase-border-width-tooltip" content="Increase Border Width" className="tw-z-[9999]"/>
            </div>

            <button
                id="reset-border-width-tooltip"
                onClick={onUnsetTableBorderWidth}
                style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1', padding: '0' }}
                data-tooltip-id="reset-border-width-tooltip"
                className={menuButtonStyles}
            >
                {/* <span className="tw-text-xs tw-pointer-events-none tw-font-semibold" style={{ opacity: 0.5 }}>1px</span> */}
                <HugeiconsIcon icon={TableIcon} size={20} className="tw-pointer-events-none" style={{ opacity: 0.5 }} />
            </button>
            <CustomTooltip id="reset-border-width-tooltip" content="Reset Border Width" className="tw-z-[9999]"/>

            <div className="tw-border-l tw-mx-1 tw-h-5"></div>

            <button id="add-column-before-tooltip" data-tooltip-id="add-column-before-tooltip" style={{transform: "rotate(180deg)"}} onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()} className={menuButtonStyles}>

                <HugeiconsIcon icon={InsertColumnLeftIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="add-column-before-tooltip" content="Insert column left" className="tw-z-[9999]"/>


            <button id="add-column-after-tooltip" data-tooltip-id="add-column-after-tooltip" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()} className={menuButtonStyles}>

                <HugeiconsIcon icon={InsertColumnLeftIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="add-column-after-tooltip" content="Insert column right" className="tw-z-[9999]"/>

            <button id="delete-column-tooltip" data-tooltip-id="delete-column-tooltip" onClick={openDeleteColumnModal} disabled={!editor.can().deleteColumn()} className={classnames(menuButtonStyles, "hover:tw-bg-red-100")}>
                <HugeiconsIcon icon={ColumnDeleteIcon} size={20} className="tw-pointer-events-none tw-text-red-600"/>
            </button>
            <CustomTooltip id="delete-column-tooltip" content="Delete column" className="tw-z-[9999]"/>

            <div className="tw-border-l tw-mx-1 tw-h-5"></div>

            <button id="add-row-before-tooltip" data-tooltip-id="add-row-before-tooltip" onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()} className={menuButtonStyles}>
                <HugeiconsIcon icon={InsertRowUpIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="add-row-before-tooltip" content="Insert row above" className="tw-z-[9999]"/>

            <button id="add-row-after-tooltip" data-tooltip-id="add-row-after-tooltip" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()} className={menuButtonStyles}>
                <HugeiconsIcon icon={InsertRowDownIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="add-row-after-tooltip" content="Insert row below" className="tw-z-[9999]"/>

            <button id="delete-row-tooltip" data-tooltip-id="delete-row-tooltip" onClick={openDeleteRowModal} disabled={!editor.can().deleteRow()} className={classnames(menuButtonStyles, "hover:tw-bg-red-100")}>
                <HugeiconsIcon icon={RowDeleteIcon} size={20} className="tw-pointer-events-none tw-text-red-600"/>
            </button>
            <CustomTooltip id="delete-row-tooltip" content="Delete row" className="tw-z-[9999]"/>

            <div className="tw-border-l tw-mx-1 tw-h-5"></div>

            <button id="merge-cells-tooltip" data-tooltip-id="merge-cells-tooltip" onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()} className={menuButtonStyles}>
                <HugeiconsIcon icon={GitMergeIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="merge-cells-tooltip" content="Merge cells" className="tw-z-[9999]"/>

            <button id="split-cell-tooltip" data-tooltip-id="split-cell-tooltip" onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()} className={menuButtonStyles}>
                <HugeiconsIcon icon={CellsIcon} size={20} className="tw-pointer-events-none"/>
            </button>
            <CustomTooltip id="split-cell-tooltip" content="Split cell" className="tw-z-[9999]"/>

            <ConfirmationModal
                id="delete-table-modal"
                isOpen={deleteTableModalState.showModal}
                confirmMessage="Are you sure you want to delete this table?"
                cancelHndlr={closeDeleteTableModal}
                confirmHndlr={handleDeleteTable}
                showImgIcon={true}
                iconType="reject"
            />

            <ConfirmationModal
                id="delete-column-modal"
                isOpen={deleteColumnModalState.showModal}
                confirmMessage="Are you sure you want to delete this column?"
                cancelHndlr={closeDeleteColumnModal}
                confirmHndlr={handleDeleteColumn}
                showImgIcon={true}
                iconType="reject"
            />

            <ConfirmationModal
                id="delete-row-modal"
                isOpen={deleteRowModalState.showModal}
                confirmMessage="Are you sure you want to delete this row?"
                cancelHndlr={closeDeleteRowModal}
                confirmHndlr={handleDeleteRow}
                showImgIcon={true}
                iconType="reject"
            />
        </BubbleMenu>
    );
};


interface CustomTipTapEditorProps {
    value?: any;
    onChange: (value: any) => void;
    onHTMLChange?: (html: any) => void;
    name: string;
    placeHolder?: string;
    formgroupClassName?: string;
    isStaticOptionsRequired?: boolean;
    invalid?: boolean,
    error?: any,
}

const CustomTipTapEditor: React.FC<CustomTipTapEditorProps> = ({ value, onChange, onHTMLChange, isStaticOptionsRequired = false, formgroupClassName, invalid, error }) => {
    const [modalType, setModalType] = useState<"Math" | "Physics" | "Chemistry" | "OCR" | "Mathematical Notation (KaTeX)" | "Code Editor" | null>(null);
    const [editingCodeInfo, setEditingCodeInfo] = useState<{ pos: number; code: string; language: string } | null>(null);
    const [activeTab, setActiveTab] = useState("basic");
    const [mathContent, setMathContent] = useState("");
    const [isEditorFocused, setIsEditorFocused] = useState(false);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [isListDropdownOpen, setListDropdownOpen] = useState(false);
    const [isTypographyDropdownOpen, setTypographyDropdownOpen] = useState(false);
    const typographyDropdownRef = useRef<HTMLDivElement>(null);
    const listDropdownRef = useRef<HTMLDivElement>(null);

    const [isCodeViewActive, setIsCodeViewActive] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [currentTextColor, setCurrentTextColor] = useState('#000000');
    const [tableBorderColor, setTableBorderColor] = useState('#000000');
    const [tableBorderWidth, setTableBorderWidth] = useState(1);

    const [toolbarHeight, setToolbarHeight] = useState(40);

    const handleEditCodeBlock = (props: any) => {
        const { getPos, node } = props;
        setEditingCodeInfo({
            pos: getPos(),
            code: node.textContent,
            language: node.attrs.language,
        });
        setModalType("Code Editor");
    };

    const editor: Editor | null = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                }
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
            }).configure({
                lowlight,
                // @ts-ignore
                onEdit: handleEditCodeBlock,
            } as any),
            Indent,
            CustomImage,
            Math.configure({}),
            Underline,
            Iframe,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            CustomTableHeader,
            CustomTableCell,

            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
            TextStyle,
            Color,
        ],
        content: ``,
        onFocus() {
            setIsEditorFocused(true);
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
            if (onHTMLChange) {
                onHTMLChange(editor.getHTML());
            }
        },
        onBlur({ event }: { event: FocusEvent }) {
            const relatedTarget = event.relatedTarget;
            if (toolbarRef.current && relatedTarget instanceof window.Node && toolbarRef.current.contains(relatedTarget)) {
                return;
            }
            setIsEditorFocused(false);
        },
    });

    const getCurrentTextColor = useCallback(() => {
        if (!editor) return '#000000';
        const color = editor.getAttributes('textStyle').color;
        return color || '#000000';
    }, [editor]);

    const handleTableBorderColorChange = useCallback((color: string) => {
        if (!editor) return;
        setTableBorderColor(color); 
        
        document.documentElement.style.setProperty('--border-color', color);
        
        editor.chain().focus()
            .setCellAttribute('borderColor', color) 
            .run();
    }, [editor]);

    const handleTableBorderWidthChange = useCallback((width: number) => {
        if (!editor) return;
        setTableBorderWidth(width);
        
        editor.chain().focus()
            .setCellAttribute('borderWidth', `${width}px`)
            .run();
    }, [editor]);

    const handleUnsetTableBorderWidth = useCallback(() => {
        if (!editor) return;
        setTableBorderWidth(1);
        
        editor.chain().focus()
            .setCellAttribute('borderWidth', null)
            .run();
    }, [editor]);

    const handleUnsetTableBorderColor = useCallback(() => {
        if (!editor) return;
        setTableBorderColor('#000000'); 
        
        document.documentElement.style.removeProperty('--border-color');
        
        editor.chain().focus()
            .setCellAttribute('borderColor', null) 
            .run();
    }, [editor]);

    useEffect(() => {
        if (!editor) return;

        const readBorderAttributes = () => {
            let attrs: any = {};
            if (editor.isActive('tableCell')) {
                attrs = editor.getAttributes('tableCell');
            } else if (editor.isActive('tableHeader')) {
                attrs = editor.getAttributes('tableHeader');
            }

            const currentCellColor = attrs?.borderColor || '#000000';
            const currentCellWidth = attrs?.borderWidth ? parseInt(attrs.borderWidth) : 1;
            
            if (currentCellColor !== tableBorderColor) {
                setTableBorderColor(currentCellColor);
                if (currentCellColor !== '#000000') {
                    document.documentElement.style.setProperty('--border-color', currentCellColor);
                } else {
                    document.documentElement.style.removeProperty('--border-color');
                }
            }

            if (currentCellWidth !== tableBorderWidth) {
                setTableBorderWidth(currentCellWidth);
            }
        };

        const updateOnSelection = () => {
            if (editor.isActive('table')) {
                readBorderAttributes();
            } else {
                setTableBorderColor('#000000');
                setTableBorderWidth(1);
                document.documentElement.style.removeProperty('--border-color');
            }
        };

        editor.on('selectionUpdate', updateOnSelection);
        editor.on('update', updateOnSelection);
        
        return () => {
            editor.off('selectionUpdate', updateOnSelection);
            editor.off('update', updateOnSelection);
        };
    }, [editor, tableBorderColor, tableBorderWidth]);

    useEffect(() => {
        if (editor && value && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    useEffect(() => {
        if (!editor) return;
        
        const updateColor = () => {
            const color = getCurrentTextColor();
            setCurrentTextColor(color);
        };

        editor.on('selectionUpdate', updateColor);
        editor.on('update', updateColor);

        return () => {
            editor.off('selectionUpdate', updateColor);
            editor.off('update', updateColor);
        };
    }, [editor, getCurrentTextColor]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                if (typographyDropdownRef.current && !typographyDropdownRef.current.contains(event.target)) {
                    setTypographyDropdownOpen(false);
                }
                if (listDropdownRef.current && !listDropdownRef.current.contains(event.target)) {
                    setListDropdownOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isEditorFocused && toolbarRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const newHeight = entry.target.getBoundingClientRect().height;
                    setToolbarHeight(newHeight);
                }
            });

            resizeObserver.observe(toolbarRef.current);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [isEditorFocused]);


    const toggleCodeView = useCallback(() => {
        if (!editor) return;

        if (isCodeViewActive) {
            editor.commands.setContent(htmlContent, { emitUpdate: false });
        } else {
            setHtmlContent(editor.getHTML());
        }
        setIsCodeViewActive(prev => !prev);
    }, [editor, isCodeViewActive, htmlContent]);

    const insertToEditor = useCallback((content: string, type: "math" | "chemistry" | "physics" | "Mathematical Notation (KaTeX)" | "code", options?: { language?: string }) => {
        if (!editor) return;

        if (type === "code") {
            const { language } = options || {};
            const codeContent = { type: 'codeBlock', attrs: { language }, content: [{ type: 'text', text: content }] };
            if (editingCodeInfo) {
                editor.chain().focus()
                    .command(({ tr, dispatch }) => {
                        tr.setNodeMarkup(editingCodeInfo.pos, undefined, { language });
                        const node = tr.doc.nodeAt(editingCodeInfo.pos);
                        if (node) {
                            const from = editingCodeInfo.pos + 1;
                            const to = from + node.content.size;
                            tr.replaceWith(from, to, editor.schema.text(content));
                        }
                        if (dispatch) dispatch(tr);
                        return true;
                    }).run();
            } else {
                editor.chain().focus().insertContent(codeContent).run();
            }
        } else if (type === "math" || type === "Mathematical Notation (KaTeX)") {
            // editor.commands.insertContent({ type: "inlineMath", attrs: { latex: content } });
            const { state, view } = editor;
            const { selection } = state;
            const { $from } = selection;

            const node = $from.nodeAfter;

            if (node?.type.name === 'inlineMath') {
                const pos = $from.pos;

                editor.chain().focus().command(({ tr, dispatch }) => {
                    if (dispatch) {
                        tr.setNodeMarkup(pos, undefined, { latex: content });
                        dispatch(tr);
                    }
                    return true;
                }).run();
            } else {
                editor.chain().focus().insertInlineMath({ latex: content }).run();
            }
        } else if (type === "physics") {
            editor.commands.insertContent({ type: "image", attrs: { src: content, alt: "Physics diagram", title: "Physics" } });
        } else {
            editor.commands.insertContent({ type: "image", attrs: { src: content, alt: "Chemical structure", title: "Chemical" } });
        }
        setModalType(null);
        setEditingCodeInfo(null);
    }, [editor, editingCodeInfo]);

    const props = {
        modalType, activeTab, setActiveTab, mathContent, setMathContent, insertToEditor, setModalType, editingCodeInfo, setEditingCodeInfo
    };

    const listIcons = {
        bullet: (
            <HugeiconsIcon icon={LeftToRightListBulletIcon} className="tw-pointer-events-none" />
        ),
        ordered: (
            <HugeiconsIcon icon={LeftToRightListNumberIcon} className="tw-pointer-events-none" />
        )
    };

    const typographyOptions = [
        { level: 1, label: 'Heading 1', size: '2em' },
        { level: 2, label: 'Heading 2', size: '1.5em' },
        { level: 3, label: 'Heading 3', size: '1.25em' },
        { level: 4, label: 'Heading 4', size: '1.1em' },
        { level: 5, label: 'Heading 5', size: '1em' },
        { level: 6, label: 'Heading 6', size: '0.9em' },
    ];

    const getActiveListType = () => {
        if (editor?.isActive('orderedList')) {
            return 'ordered';
        }
        return 'bullet';
    };
    const activeListType = getActiveListType();

    const getActiveTypography = useCallback(() => {
        const activeOption = typographyOptions.find(option => editor?.isActive('heading', { level: option.level as 1 | 2 | 3 | 4 | 5 | 6 }));
        return activeOption?.label || 'Normal';
    }, [editor, typographyOptions]);

    const handleColorChange = useCallback((color: string) => {
        if (!editor) return;
        editor.chain().focus().setColor(color).run();
        setCurrentTextColor(color);
    }, [editor]);

    const handleUnsetColor = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().unsetColor().run();
        setCurrentTextColor('#000000');
    }, [editor]);

    const btnListFunc = () => {
        const iconClassName = isStaticOptionsRequired ? "tw-text-xl tw-text-black" : "tw-text-xl";
        const btnClassName = (name: string, level?: number) => {
            const options = level ? { level: level as 1 | 2 | 3 | 4 | 5 | 6 } : {};
            return classnames(`btn ${isStaticOptionsRequired ? "btn-outline-light" : "btn-outline-primary"} btn-sm`, { 'active': editor?.isActive(name, options) });
        }
        return (
            <>
                <div
                    className="tw-relative"
                    ref={typographyDropdownRef}
                >
                    <button
                        onClick={() => setTypographyDropdownOpen(prev => !prev)}
                        style={{ ...toolbarButtonSizing, width: 'auto', padding: '0 6px', minWidth: '100px', fontSize: '12px', ...(isStaticOptionsRequired ? { color: 'black' } : {}) }}
                        className={`btn ${isStaticOptionsRequired ? "btn-outline-light" : "btn-outline-primary"} btn-sm d-flex align-items-center justify-content-between`}
                    >
                        <span>{getActiveTypography()}</span>
                        <HugeiconsIcon icon={UnfoldMoreIcon} size={16} className="ms-1 tw-pointer-events-none"/>
                    </button>
                    {isTypographyDropdownOpen && (
                        <div
                            className="tw-absolute tw-bg-white tw-border tw-rounded tw-shadow-lg p-1"
                            style={{ top: '100%', left: 0, zIndex: 30, width: '180px' }}
                        >
                            {typographyOptions.map(option => (
                                <button
                                    key={option.level}
                                    onClick={() => { editor?.chain().focus().toggleHeading({ level: option.level as 1 | 2 | 3 | 4 | 5 | 6 }).run(); setTypographyDropdownOpen(false); }}
                                    className={classnames(
                                        `btn btn-light btn-sm d-flex align-items-center justify-content-between w-100 text-start mb-1`,
                                        { 'active': editor?.isActive('heading', { level: option.level as 1 | 2 | 3 | 4 | 5 | 6 }) }
                                    )}
                                >
                                    <span style={{ fontSize: option.size }}>{option.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => { editor?.chain().focus().setParagraph().run(); setTypographyDropdownOpen(false); }}
                                className={classnames("btn btn-light btn-sm d-flex align-items-center justify-content-between w-100 text-start", { 'active': editor?.isActive('paragraph') })}
                            >
                                Normal
                            </button>
                        </div>
                    )}
                </div>

                <button id="bold-text-tooltip" onClick={() => editor?.chain().focus().toggleBold().run()}
                    style={toolbarButtonSizing}
                    data-tooltip-id="bold-text-tooltip"
                    className={btnClassName('bold')}>
                    <HugeiconsIcon icon={TextBoldIcon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                </button>
                <CustomTooltip id="bold-text-tooltip" content="Bold" />
                
                <button id="italic-text-tooltip" onClick={() => editor?.chain().focus().toggleItalic().run()}
                    style={toolbarButtonSizing}
                    data-tooltip-id="italic-text-tooltip"
                    className={btnClassName('italic')}>
                    <HugeiconsIcon icon={TextItalicIcon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                </button>
                <CustomTooltip id="italic-text-tooltip" content="Italic" />
                
                <button id="underline-text-tooltip" onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    style={toolbarButtonSizing}
                    data-tooltip-id="underline-text-tooltip"
                    className={btnClassName('underline')}>
                    <HugeiconsIcon icon={TextUnderlineIcon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                </button>
                <CustomTooltip id="underline-text-tooltip" content="Underline" />
                
                <button id="strike-text-tooltip" onClick={() => editor?.chain().focus().toggleStrike().run()}
                    style={toolbarButtonSizing}
                    data-tooltip-id="strike-text-tooltip"
                    className={btnClassName('strike')}>
                    <HugeiconsIcon icon={TextStrikethroughIcon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                </button>
                <CustomTooltip id="strike-text-tooltip" content="Strike" />

                <div className="border-start mx-1" style={{ height: '24px' }}></div>
                
                <div
                    className="tw-relative"
                    ref={listDropdownRef}
                >
                    <button
                        onClick={() => setListDropdownOpen(prev => !prev)}
                        id="lists-tooltip"
                        style={toolbarButtonSizing}
                        className={classnames(`btn ${isStaticOptionsRequired ? "btn-outline-light !tw-text-black" : "btn-outline-primary"} btn-sm`, { 'active': editor?.isActive('bulletList') || editor?.isActive('orderedList') })}
                    >
                        {listIcons[activeListType]}
                    </button>
                    <CustomTooltip id="lists-tooltip" content="Lists" />
                    {isListDropdownOpen && (
                        <div
                            className="tw-absolute tw-bg-white tw-border tw-rounded tw-shadow-lg p-1"
                            style={{ top: '100%', left: 0, zIndex: 30, width: 'auto', whiteSpace: 'nowrap' }}
                        >
                            <button
                                id="unordered-list-tooltip"
                                onClick={() => { editor?.chain().focus().toggleBulletList().run(); setListDropdownOpen(false); }}
                                className={classnames("btn btn-light btn-sm d-flex align-items-center gap-2 w-100 text-start mb-1", { 'active': editor?.isActive('bulletList') })}
                            >
                                {listIcons.bullet} Unordered
                            </button>
                            <button
                                id="ordered-list-tooltip"
                                onClick={() => { editor?.chain().focus().toggleOrderedList().run(); setListDropdownOpen(false); }}
                                className={classnames("btn btn-light btn-sm d-flex align-items-center gap-2 w-100 text-start", { 'active': editor?.isActive('orderedList') })}
                            >
                                {listIcons.ordered} Ordered
                            </button>
                        </div>
                    )}
                </div>
                
                {isStaticOptionsRequired && <>
                    <button id="undo-tooltip" onClick={() => editor?.chain().focus().undo().run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="undo-tooltip"
                        disabled={!editor?.can().undo()}
                        className={`btn ${isStaticOptionsRequired ? "btn-outline-light" : "btn-outline-primary"} btn-sm`}>
                        <HugeiconsIcon icon={Undo02Icon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                    </button>
                    <CustomTooltip id="undo-tooltip" content="Undo" />
                    <button id="redo-tooltip" onClick={() => editor?.chain().focus().redo().run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="redo-tooltip"
                        disabled={!editor?.can().redo()}
                        className={`btn ${isStaticOptionsRequired ? "btn-outline-light" : "btn-outline-primary"} btn-sm`}>
                        <HugeiconsIcon icon={Redo02Icon} size={18} className={classnames("tw-pointer-events-none " + iconClassName)} />
                    </button>
                    <CustomTooltip id="redo-tooltip" content="Redo" />
                    <button id="left-text-tooltip" onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="left-text-tooltip"
                        className={btnClassName('left')}> <HugeiconsIcon icon={LeftToRightBlockQuoteIcon} className={classnames("tw-pointer-events-none " + iconClassName)} /></button>
                    <CustomTooltip id="left-text-tooltip" content="Left Align" />
                    <button id="center-text-tooltip" onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="center-text-tooltip"
                        className={btnClassName('center')}> <HugeiconsIcon icon={TextAlignCenterIcon} className={classnames("tw-pointer-events-none " + iconClassName)} /></button>
                    <CustomTooltip id="center-text-tooltip" content="Center Align" />
                    <button id="right-text-tooltip" onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="right-text-tooltip"
                        className={btnClassName('right')}> <HugeiconsIcon icon={RightToLeftBlockQuoteIcon} className={classnames("tw-pointer-events-none " + iconClassName)} /></button>
                    <CustomTooltip id="right-text-tooltip" content="Right Align" />
                    <button id="highlight-text-tooltip" onClick={() => editor?.chain().focus().toggleHighlight().run()}
                        style={toolbarButtonSizing}
                        data-tooltip-id="highlight-text-tooltip"
                        className={btnClassName('highlight')}> <HugeiconsIcon icon={HighlighterIcon} className={classnames("tw-pointer-events-none " + iconClassName)} /></button>
                    <CustomTooltip id="highlight-text-tooltip" content="Highlight" />
                    <div className="tw-relative tw-inline-block">
                        <input
                            type="color"
                            value={currentTextColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="tw-w-8 tw-h-8 tw-border tw-border-gray-300 tw-rounded tw-cursor-pointer tw-opacity-0 tw-absolute tw-inset-0"
                            style={{ ...toolbarButtonSizing, padding: 0 }}
                            data-tooltip-id="text-color-tooltip"
                        />
                        <button
                            id="text-color-tooltip"
                            style={toolbarButtonSizing}
                            data-tooltip-id="text-color-tooltip"
                            className={btnClassName('textStyle')}
                            onClick={() => {
                                const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
                                colorInput?.click();
                            }}
                        >
                            <HugeiconsIcon icon={TextColorIcon} color={currentTextColor} className={classnames("tw-pointer-events-none")} />
                        </button>
                        <CustomTooltip id="text-color-tooltip" content="Text Color" />
                    </div>                    
                    <button
                        id="unset-color-tooltip"
                        onClick={handleUnsetColor}
                        style={toolbarButtonSizing}
                        data-tooltip-id="unset-color-tooltip"
                        className={`btn ${isStaticOptionsRequired ? "btn-outline-light" : "btn-outline-primary"} btn-sm`}
                    >
                        <HugeiconsIcon icon={TextColorIcon} className={classnames("tw-pointer-events-none " + iconClassName)} style={{ opacity: 0.5 }} />
                    </button>
                    <CustomTooltip id="unset-color-tooltip" content="Remove Color" />
                    <TipTapTableExtension editor={editor} toolbarButtonSizing={toolbarButtonSizing} classStyles={isStaticOptionsRequired ? "tw-text-xl tw-text-black" : "tw-text-xl"} isStaticOptionsRequired={isStaticOptionsRequired} />
                    <TipTapImageExtension editor={editor} toolbarButtonSizing={toolbarButtonSizing} classStyles={isStaticOptionsRequired ? "tw-text-xl tw-text-black" : "tw-text-xl"} isStaticOptionsRequired={isStaticOptionsRequired} />
                </>}
            </>
        )
    }

    const toolbarButtonSizing = {
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
        padding: '0',
    };

    return (
        <div className={classnames("tw-mt-4 " + formgroupClassName)} style={{ position: 'relative' }}>
            {isEditorFocused && !isStaticOptionsRequired && (
                <div
                    ref={toolbarRef}
                    className="d-flex tw-flex-wrap justify-content-start align-items-center bg-white border rounded p-1 tw-shadow-xl mx-auto"
                    style={{
                        position: 'absolute',
                        top: -toolbarHeight,
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <div className="btn-group my-1" role="group" aria-label="Text formatting">
                        {btnListFunc()}
                        <TipTapTableExtension editor={editor} toolbarButtonSizing={toolbarButtonSizing} />
                        <TipTapImageExtension editor={editor} toolbarButtonSizing={toolbarButtonSizing} />
                        <TipTapVideoExtension editor={editor} toolbarButtonSizing={toolbarButtonSizing} />
                    </div>
                    <div className="border-start mx-1" style={{ height: '24px' }}></div>
                    <div className="btn-group my-1" role="group" aria-label="Lists and indentation">
                        <button
                            id="outdent-tooltip"
                            data-tooltip-id="outdent-tooltip"
                            style={toolbarButtonSizing}
                            onClick={() => editor?.chain().focus().outdent().run()}
                            disabled={!editor?.can().outdent()}
                            className="btn btn-outline-primary btn-sm"
                        >
                            <HugeiconsIcon icon={TextIndentLessIcon} className="tw-pointer-events-none" />
                        </button>
                        <CustomTooltip id="outdent-tooltip" content="Outdent" />
                        <button
                            id="indent-tooltip"
                            data-tooltip-id="indent-tooltip"
                            style={toolbarButtonSizing}
                            onClick={() => editor?.chain().focus().indent().run()}
                            disabled={!editor?.can().indent()}
                            className="btn btn-outline-primary btn-sm"
                        >
                            <HugeiconsIcon icon={TextIndentMoreIcon} className="tw-pointer-events-none" />
                        </button>
                        <CustomTooltip id="indent-tooltip" content="Indent" />
                    </div>
                    <div className="border-start mx-1" style={{ height: '24px' }}></div>
                    <button
                        id="code-view-tooltip"
                        data-tooltip-id="code-view-tooltip"
                        style={toolbarButtonSizing}
                        onClick={toggleCodeView}
                        className={classnames("btn btn-outline-primary btn-sm", { 'active': isCodeViewActive })}
                    >
                        <HugeiconsIcon icon={SourceCodeIcon} className="tw-pointer-events-none" />
                    </button>
                    <CustomTooltip id="code-view-tooltip" content="Code View" />

                    <div className="border-start mx-1" style={{ height: '24px' }}></div>
                    <div className="flex-grow-1">
                        <button id="math-notation-tooltip" data-tooltip-id="math-notation-tooltip" style={toolbarButtonSizing} className="btn btn-outline-primary btn-sm" onClick={() => setModalType("Mathematical Notation (KaTeX)")}>

                            <HugeiconsIcon icon={Summation01Icon} className="tw-pointer-events-none" />
                        </button>
                        <CustomTooltip id="math-notation-tooltip" content="Math" />
                    </div>

                    <div className="btn-group" role="group" aria-label="Special content">
                        <button id="math-editor-tooltip" data-tooltip-id="math-editor-tooltip" style={toolbarButtonSizing} className="btn btn-outline-primary btn-sm" onClick={() => setModalType("Math")}><HugeiconsIcon icon={FunctionOfXIcon} className="tw-pointer-events-none" /></button>

                        <CustomTooltip id="math-editor-tooltip" content="Math Editor" />

                        <button id="physics-tooltip" data-tooltip-id="physics-tooltip" style={toolbarButtonSizing} className="btn btn-outline-primary btn-sm" onClick={() => setModalType("Physics")}><HugeiconsIcon icon={PulleyIcon} className="tw-pointer-events-none" /></button>

                        <CustomTooltip id="physics-tooltip" content="Physics" />

                        <button id="chemistry-tooltip" data-tooltip-id="chemistry-tooltip" style={toolbarButtonSizing} className="btn btn-outline-primary btn-sm" onClick={() => setModalType("Chemistry")}><HugeiconsIcon icon={TestTube01Icon} className="tw-pointer-events-none" /></button>

                        <CustomTooltip id="chemistry-tooltip" content="Chemistry" />

                        <button id="code-editor-tooltip" data-tooltip-id="code-editor-tooltip" style={toolbarButtonSizing} className="btn btn-outline-primary btn-sm" onClick={() => setModalType("Code Editor")}><HugeiconsIcon icon={SourceCodeSquareIcon} className="tw-pointer-events-none" /></button>

                        <CustomTooltip id="code-editor-tooltip" content="Code Editor" />
                    </div>
                </div>
            )}

            <div className="tiptap-editor">
                {isStaticOptionsRequired && <div className="tw-sticky tw-top-0 tw-z-10 tw-bg-white tw-border-[1px] tw-border-[#ddd] tw-border-b-0">
                    <div className="tw-flex tw-items-center tw-flex-wrap tw-p-1 tw-gap-1" role="group" aria-label="Text formatting">
                        {btnListFunc()}
                    </div>
                </div>}

                {editor && <TableBubbleMenu 
                    editor={editor} 
                    tableBorderColor={tableBorderColor}
                    onTableBorderColorChange={handleTableBorderColorChange}
                    onUnsetTableBorderColor={handleUnsetTableBorderColor}
                    tableBorderWidth={tableBorderWidth}
                    onTableBorderWidthChange={handleTableBorderWidthChange}
                    onUnsetTableBorderWidth={handleUnsetTableBorderWidth}
                />}

                {isCodeViewActive ? (
                    <textarea
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        className="tw-block tw-w-full tw-p-4 tw-font-mono tw-text-sm tw-bg-[#1e1e1e] tw-text-[#e6e5e5] tw-border tw-border-[#c4c3c3] tw-min-h-[100px] tw-resize-y tw-outline-none tw-leading-[1.5] tw-rounded-[6px]"
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}

                <MathNodeMenu editor={editor} setModalType={setModalType} setMathContent={setMathContent} modalType={modalType} />
            </div>
            {invalid && error && (
                <div className="invalid-feedback d-block">
                    <div className="mb-2">{error}</div>
                </div>
            )}
            <ModalContainerUpdated id="my-modal" isOpen={!!modalType} toggle={() => { setModalType(null); setEditingCodeInfo(null); }} modalTitle={modalType === 'Mathematical Notation (KaTeX)' ? 'Mathematical Notation' : modalType === 'Code Editor' ? 'Code Editor' : `${modalType} Editor`} modalSize={modalType === 'Mathematical Notation (KaTeX)' ? 'md' : modalType === 'Code Editor' ? 'lg' : 'xl'}>
                <CustomTipTapEditorModal {...props} />
            </ModalContainerUpdated>
        </div>
    )
}

export default CustomTipTapEditor;