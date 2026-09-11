import React, { Suspense, useEffect, useRef, useState } from 'react'
import MathsEditor from './MathsEditor';
import { Editor as KetcherEditor } from "ketcher-react";
import "ketcher-react/dist/index.css";
import { Ketcher } from 'ketcher-core';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';
import PhysicsEditor from './PhysicsEditor';
import Konva from 'konva';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

const structServiceProvider = new StandaloneStructServiceProvider();

const CustomTipTapEditorModal = (props: any) => {
    const { modalType, activeTab, setActiveTab, mathContent, setMathContent, insertToEditor, setModalType, editingCodeInfo, setEditingCodeInfo } = props || {};
    const ketcherRef = useRef<Ketcher | null>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const layerRef = useRef<Konva.Layer>(null);

    const [mathNotationContent, setMathNotationContent] = useState('');
    const [renderedMath, setRenderedMath] = useState<string>('');

    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('js');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const prismLanguages = { text: languages.clike, js: languages.js, python: languages.python, html: languages.markup, react: languages.jsx };

    useEffect(() => {
        if (modalType === 'Code Editor' && editingCodeInfo) {
            setCode(editingCodeInfo.code || '');
            setLanguage(editingCodeInfo.language || 'js');
        } else {
            setCode('');
            setLanguage('js');
        }
    }, [modalType, editingCodeInfo]);

    useEffect(() => {
        return () => {
            setMathContent("");
            setMathNotationContent('');
            setActiveTab("basic");
        }
    }, [modalType]);

    const handleInit = (ketcher: Ketcher) => { ketcherRef.current = ketcher; };
    const blobToDataURL = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    const renderKaTeX = (latex: string) => {
        try {
            return katex.renderToString(latex, {
                throwOnError: false, // Prevents app crash on invalid syntax
                displayMode: true,   // Renders the math in a larger, block format
            });
        } catch (err) {
            console.error('KaTeX rendering error:', err);
            // Return the original text with an error message if rendering fails
            return `<span class="text-danger">Error: Invalid KaTeX syntax.</span>`;
        }
    }

    return (
        <>
            {modalType === "Math" && (<MathsEditor activeTab={activeTab} setActiveTab={setActiveTab} mathContent={mathContent} setMathContent={setMathContent} />)}
            {modalType === "Physics" && (<PhysicsEditor stageRef={stageRef} transformerRef={transformerRef} layerRef={layerRef} />)}
            {modalType === "Chemistry" && (
                <div style={{ height: "500px" }}>
                    <Suspense fallback={<div>Loading Chemistry Editor...</div>}>
                        <KetcherEditor staticResourcesUrl="" structServiceProvider={structServiceProvider} errorHandler={message => console.error(message)} onInit={handleInit} />
                    </Suspense>
                </div>
            )}
            {modalType === "Code Editor" && (
                <div className="tw-p-2">
                    <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-mb-2">
                        <select className="form-select form-select-md" value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '120px' }}>
                            <option value="text">Text</option>
                            <option value="js">Js</option>
                            <option value="python">Python</option>
                            <option value="html">Html</option>
                            <option value="react">React</option>
                        </select>
                        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-center">
                            <label className="form-check-label" htmlFor="darkModeSwitch">Dark mode</label>
                            <div className="form-check form-switch tw-text-xl">
                                <input className="form-check-input" type="checkbox" role="switch" id="darkModeSwitch" checked={isDarkMode} onChange={() => setIsDarkMode(p => !p)} />
                            </div>
                        </div>
                    </div>
                    <CodeEditor value={code} onValueChange={newCode => setCode(newCode)} highlight={codeToHighlight => highlight(codeToHighlight, prismLanguages[language] || languages.clike, language)} padding={15} className={isDarkMode ? 'prism-dark-theme' : 'prism-light-theme'} style={{ fontSize: 14, border: `1px solid ${isDarkMode ? '#444' : '#ced4da'}`, borderRadius: '0.375rem', minHeight: '350px', outline: 'none' }} />
                </div>
            )}
            {modalType === "Mathematical Notation (KaTeX)" && (
                <div className="tw-flex tw-flex-col tw-p-3" style={{ height: 'auto' }}>                   
                    {/* Input Textarea */}
                    <div className="tw-flex-grow">
                        <textarea
                            className="form-control"
                            value={mathNotationContent}
                            onChange={(e) => {
                                setMathNotationContent(e.target.value);
                                setRenderedMath(renderKaTeX(e.target.value));
                            }}
                            placeholder="Enter KaTeX code here..."
                            rows={6}
                            style={{ resize: 'vertical' }} // Allow vertical resizing
                        />
                    </div>

                    {/* Live Preview Area */}
                    <div className="tw-mt-4">
                        <h6 className="tw-mb-2 tw-font-semibold">Preview</h6>
                        <div
                            className="tw-p-3 tw-border tw-rounded tw-bg-gray-100 tw-flex tw-items-center tw-justify-center"
                            style={{ minHeight: '80px', overflow: 'auto' }}
                            // The preview area with a placeholder
                            dangerouslySetInnerHTML={{ __html: renderedMath || '<span class="tw-text-gray-500">Type some KaTeX to see a live preview.</span>' }}
                        />
                    </div>
                </div>
            )}
            <div className="tw-flex tw-justify-end tw-gap-2 tw-p-3" style={{ background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
                <button onClick={() => { setModalType(null); setEditingCodeInfo?.(null); }} className="btn btn-light">Cancel</button>
                <button className="btn btn-success" onClick={async () => {
                    if (modalType === "Code Editor") {
                        insertToEditor(code, "code", { language });
                    } else if (modalType === "Math") {
                        if (mathContent.trim()) insertToEditor(mathContent, "math");
                    } else if (modalType === "Chemistry") {
                        const mol = await ketcherRef?.current?.getMolfile();
                        const image = await ketcherRef?.current?.generateImage(mol || "");
                        if (mol && image) {
                            const dataUrl = await blobToDataURL(image);
                            insertToEditor(dataUrl, "chemistry");
                        }
                    } else if (modalType === "Physics") {
                        if (transformerRef.current) {
                            transformerRef.current.visible(false);
                            layerRef.current?.batchDraw();
                        }
                        const box = stageRef.current?.getClientRect({ skipTransform: false });
                        let dataUrl: string | undefined = undefined;
                        if (box) dataUrl = stageRef.current?.toDataURL({ x: box.x, y: box.y, width: box.width, height: box.height, pixelRatio: 1 });
                        if (transformerRef.current) {
                            transformerRef.current.visible(true);
                            layerRef.current?.batchDraw();
                        }
                        if (dataUrl) insertToEditor(dataUrl, "physics");
                    } else if (modalType === "Mathematical Notation (KaTeX)") {
                        if (mathNotationContent.trim()) insertToEditor(mathNotationContent, "Mathematical Notation (KaTeX)");
                    }
                }}>
                    {editingCodeInfo ? 'Update Code' : 'Add to editor'}
                </button>
            </div>
        </>
    )
}

export default CustomTipTapEditorModal