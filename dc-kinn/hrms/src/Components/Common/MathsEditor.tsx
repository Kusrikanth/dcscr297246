
// MathsEditor.tsx - FIXED VERSION
import React, { useEffect, useRef } from "react";
import { MathfieldElement } from "mathlive";
import ModifiedHorizontalTab from "./ModifiedHorizontalTab";
import katex from "katex";

type IMenuOptionIds = "basic" | "maths" | "matrix" | "formula" | 'arrow' | 'alphabet' | 'symbol' | 'operator' | 'functions'

interface IMenuOption {
    id: IMenuOptionIds;
    labelName: string;
    customPadding: string;
}

interface MathsEditorProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    mathContent: string;
    setMathContent: React.Dispatch<React.SetStateAction<string>>;
    setMatrixText?: React.Dispatch<React.SetStateAction<string>>;
}

const styles: Record<string, React.CSSProperties> = {
    mathField: {
        border: "1px solid #ccc",
        minHeight: "125px",
        flex: 1,
        padding: 10,
        borderRadius: "4px",
        fontSize: "22px"
    },
    grid: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginLeft: 20,
        width: "200px"
    },
    tabHeader: { display: "flex", },
    matrixButton: {
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        backgroundColor: "#f8f9fa",
        cursor: "pointer",
        fontSize: "20px"
    }
};

const tabData = {
    maths: [
        '\\\int_{ }^{ }', '\\\int_a^b', '\\\oint', '\\\oint_a^b', '\\\sum_{ }^{ }', '\\\sum_a^b',
        '\\\coprod_{ }^{ }', '\\\coprod_a^b', '\\\prod_{ }^{ }', '\\\prod_a^b', '\\bigcap', '\\bigcap_a^b',
        '\\bigcup', '\\bigcup_a^b', '\\bigsqcup', '\\bigsqcup_a^b', '\\bigvee', '\\bigvee_a^b', '\\bigwedge',
        '\\sqrt{ab}', '\\sqrt[n]{ab}', '\\log_ab', '\\lg ab', 'x^y', 'x_y', 'x_y^x', '\\\overleftarrow{ab}', '\\\overrightarrow{ab}',
        '\\underline{ab}', '\\overline{ab}', '\\frac{ab}{cd}', '\\frac{\\partial a}{\\partial b}', '\\frac{dx}{dy}', '\\lim_{a\\rightarrow b}',
    ],
    matrix: [
        '\a3=a1*a2^{-1}', '\a3=a2^T', 'r=a2-a1', 'r=a2*a1', 'r=\det(a2)',
        '\\left[\\begin{array}{cc}a & b \\\\ c & d\\end{array}\\right]',
        'a=\\left[\\begin{matrix}a & b & c \\\\ d & e & f \\\\ g & h & i\\end{matrix}\\right]', 'a=\\left[\\begin{matrix}a & b & c & d \\\\ e & f & g & h \\\\ i & j & k & l \\\\ m & n & o & p\\end{matrix}\\right]',
        '\\begin{vmatrix}a & b \\\\ c & d\\end{vmatrix}', 'a=\\begin{vmatrix}a & b & c \\\\ d & e & f \\\\ g & h & i\\end{vmatrix}',
        'a=\\begin{vmatrix}a & b & c & d \\\\ e & f & g & h \\\\ i & j & k & l \\\\ m & n & o & p\\end{vmatrix}'
    ],
    basic: [
        '.', '\\cdot', '*', '+', '-', '\\div', '\\times', '=', '\\neq',
        '\\vdots', '\\ddots', '{,}', '`', '!', ';', '?', '\\bar{x}', '\\vec{x}',
        '\\dot{x}', '\\tilde{x}', '\\hat{x}',
        '\\backslash', '/', '\\setminus', '|', '\\|', '\\|', '[', ']',
        '\\\lbrace', '\\rbrace', '\\\lceil', '\\rceil', '\\\lfloor', '\\rfloor'
    ],
    formula: [
        // '\\begin{array}{r|l} a & b \\\\ c & d \\\\ e & f \\\\ g & h \\\\ & i \\end{array}',
        'x = \\left\\{ \\begin{array}{l} a \\\\ c \\end{array} \\right.',
        '\\left( \\begin{array}{ll} a & b \\end{array} \\right)',
        '\\left(\\frac{a^2}{b^3}\\right)', '\\sqrt{\\frac{n}{n-1}S},', '\\begin{pmatrix} \\alpha & \\beta^*\\gamma^* & \\delta \\end{pmatrix}',
        '\\frac{1}{k}\log_2c(f);', 'x^n + y^n = z^n', 'E = mc^2', 'e^{\\pi i} - 1 = 0', 'p(x) = 3x^6', '3x + y = 12',
        '\\int_0^{\\infty} \\mathrm{e}^{-x} \\, \\mathrm{d}x', '\\sqrt[n]{1 + x + x^2 + \\ldots}', '\\binom{x}{y} = \\frac{x!}{y!(x - y)!}',
        '\\frac{\\frac{1}{x} + \\frac{1}{y}}{y - z}', 'f(x) = \\frac{P(x)}{Q(x)}', '\\frac{1+\\frac{a}{b}}{1+\\frac{1}{1+\\frac{1}{a}}}',
        '\\lim_{x \\to \\infty} \\exp(-x) = 0', '\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta',
    ],
    arrow: [
        '\\uparrow', '\\downarrow', '\\updownarrow', '\\Uparrow', '\\Downarrow', '\\Leftarrow', '\\Rightarrow', '\\Leftrightarrow', '\\Updownarrow',
        '\\nwarrow', '\\swarrow', '\\searrow', '\\nearrow', '\\longleftarrow', '\\longrightarrow', '\\rightarrow', '\\leftarrow', '\\Longleftarrow',
        '\\Longrightarrow', '\\longleftrightarrow', '\\Longleftrightarrow', '\\rightharpoondown', '\\leftharpoondown', '\\leftharpoonup',
        '\\hookleftarrow', '\\hookrightarrow',
    ],
    alphabet: [
        "\\leftrightarrow", "\\aleph", "\\Gamma", "\\alpha", "\\xi", "\\digamma", "\\Delta", "\\beta", "\\pi",
        "\\varepsilon", "\\Lambda", "\\gamma", "\\rho", "\\varkappa", "\\Phi", "\\delta", "\\sigma", "\\varphi",
        "\\Pi", "\\epsilon", "\\tau", "\\varpi", "\\Psi", "\\zeta", "\\upsilon", "\\varrho", "\\Sigma",
        "\\eta", "\\phi", "\\varsigma", "\\Theta", "\\theta", "\\chi", "\\vartheta", "\\Upsilon", "\\iota",
        "\\psi", "\\Xi", "\\kappa", "\\omega", "\\Omega", "\\lambda", "\\mu", "\\nu", "\\Im", "\\ell", "\\Re",
        "\\partial", "\\hbar", "\\wp"
    ],
    symbol: [
        "₹", "\\#", "\\clubsuit", "\\square", "\\&", "\\measuredangle", "\\surd", "\\angle", "\\nabla", "\\top", "\\diamondsuit", "\\natural",
        "\\triangle", "\\varnothing", "\\neg", "\\exists", "\\nexists", "\\varnothing", "\\flat", '`', "\\blacktriangle", "\\forall",
        "\\sharp", "\\heartsuit", "\\spadesuit", "\\bot", "\\infty", "\\sphericalangle", "°C", "°F", "\\therefore", "A\\cup B",
        "_Z^AX", 'X_Z^A', "\\rho"
    ],
    operator: [">", "<", "\\le", "\\subseteq", "\\supseteq", "\\supset", "\\mp", "\\%", "\\in",
        "\\ngtr", "\\sim", "\\amalg", "\\ast", "\\bigcirc",
        "\\odot", "\\uplus", "\\ominus", "\\vee", "\\oplus", "\\dagger",
        "\\varnothing", "\\wedge", "\\ddagger", "\\otimes", "\\wr", "\\diamond",
        "\\pm", "\\bullet", "\\setminus", "\\equiv", "\\simeq", "\\succ", "\\approx", "\\ge", "\\nless", "\\approx", "\\succeq", "^{^nP}r",
        "^{^nC}r", "\\mid X\\mid"
    ],
    functions: [
        "\\sin", "\\cos", "\\tan", "\\csc", "\\sec", "\\cot", "\\sinh", "\\cosh", "\\tanh", "\\coth", "\\hom", "\\arcsin", "\\arccos", "\\det",
        "\\arctan", "\\sin^{-1}", "\\cos^{-1}", "\\tan^{-1}", "\\sinh^{-1}", "\\cosh^{-1}", "\\tanh^{-1}", "\\exp", "\\lg", "\\ln", "\\log_e",
        "\\log", "\\log_{10}", "\\lim", "\\liminf", "\\limsup", "\\max", "\\min", "\\infty", "\\inf", "\\arg", "\\det", "\\dim", "\\gcd",
        "\\hom", "\\ker", "\\Pr", "\\supset", "°", "\\injlim", "\\projlim"
    ]
};

const menuOptions: IMenuOption[] = [
    { id: "basic", labelName: "Basic", customPadding: "10px" },
    { id: "maths", labelName: "Maths", customPadding: "10px" },
    { id: "matrix", labelName: "Matrix", customPadding: "10px" },
    { id: "formula", labelName: "Formula", customPadding: "10px" },
    { id: "arrow", labelName: "Arrow", customPadding: "10px" },
    { id: "alphabet", labelName: "Alphabet", customPadding: "10px" },
    { id: "symbol", labelName: "Symbol", customPadding: "10px" },
    { id: "operator", labelName: "Operator", customPadding: "10px" },
    { id: "functions", labelName: "Functions", customPadding: "10px" },
]

const MathsEditor: React.FC<MathsEditorProps> = ({
    activeTab,
    setActiveTab,
    mathContent,
    setMathContent,
}) => {
    const mathRef = useRef<HTMLDivElement>(null);
    const mathfieldRef = useRef<MathfieldElement | null>(null);

    useEffect(() => {
        const mathfield = new MathfieldElement({
            mathVirtualKeyboardPolicy: "auto",
        });
        mathfield.smartFence = true;
        mathfield.value = mathContent;

        // Track changes
        mathfield.addEventListener("input", () => {
            console.log("MathLive content changed:", mathfield.value);
            setMathContent(mathfield.value);
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault();
                mathfield.executeCommand("insert", "\\space");
            }
        };

        if (mathRef.current) {
            mathRef.current.innerHTML = "";
            mathRef.current.appendChild(mathfield);
            mathfieldRef.current = mathfield;

            mathfield.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            mathfield.removeEventListener("keydown", handleKeyDown);
            mathfieldRef.current = null;
        };
    }, []);

    // FIXED: Corrected matrix LaTeX syntax
    const insertMatrix = (latex: string) => {
        const field = mathfieldRef.current;
        if (field) {
            console.log("Inserting matrix:", latex);
            field.insert(latex);
            const newValue = field.value;
            setMathContent(newValue);
            console.log("New field value after matrix insertion:", newValue);
        } else {
            console.error("MathField not available");
        }
    };

    const renderLatex = (latex: string) => {
        try {
            return { __html: katex.renderToString(latex, { throwOnError: false }) };
        } catch (e) {
            return { __html: latex };
        }
    };

    return (
        <>
            <div className="!tw-flex !tw-p-4 !tw-pb-2">
                <div ref={mathRef} style={styles.mathField} />
            </div>
            <div className="!tw-px-4">
                <small className="!tw-text-gray-500 !tw-text-base">
                    Current LaTeX: <code>{mathContent}</code>
                </small>
            </div>
            <div style={styles.tabHeader} className="!tw-px-4 !tw-pb-2">
                <ModifiedHorizontalTab
                    MenuOptions={menuOptions}
                    getActiveMenuId={(menuId: string) => {
                        setActiveTab(menuId);
                    }}
                    activeTabId={activeTab}
                    horizontalClass="!tw-pt-2 !tw-mb-2 !tw-overflow-auto"
                    labelClass='!tw-text-nowrap'
                />
            </div>
            <div className="tw-gap-2 tw-px-4 tw-flex tw-flex-wrap tw-items-center">
                {tabData[activeTab]?.map((latex:string, index:number) => (
                    <button
                        key={index}
                        className={`tw-border tw-rounded tw-p-3 tw-text-center tw-fw-bold tw-bg-gray-100 tw-mx-2 tw-mb-2 tw-fs-5 tw-flex tw-items-center tw-justify-center ${activeTab === "basic" && "tw-h-20 tw-max-h-30 tw-w-10 "} hover:tw-border hover:!tw-border-[#198754] `}
                        onClick={() => insertMatrix(latex)}
                        dangerouslySetInnerHTML={renderLatex(latex)}
                    />
                ))}
            </div>
        </>
    );
};

export default MathsEditor;