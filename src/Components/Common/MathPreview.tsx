import { JSONContent } from "@tiptap/react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export function MathPreview({ json }: { json: JSONContent | undefined }) {
    return (
        <MathJaxContext>
            <div>
                {json?.content?.map((block, i) => {
                    if (block?.type === "paragraph") {
                        return (
                            <p key={i} className="tw-flex tw-items-center tw-mb-0">
                                {block?.content?.map((item, j) => {
                                    if (item.type === "text") {
                                        return <span key={j}>{item?.text}</span>;
                                    }
                                    if (item.type === "inlineMath") {
                                        const isDisplay = item.attrs?.display === "yes";
                                        return (
                                            <MathJax dynamic key={j}>
                                                {isDisplay
                                                    ? `\\[${item?.attrs?.latex}\\]`
                                                    : `\\(${item?.attrs?.latex}\\)`}
                                            </MathJax>
                                        );
                                    }
                                    return null;
                                })}
                            </p>
                        );
                    }

                    if (block?.type === "image") {
                        return (
                            <img
                                key={i}
                                src={block?.attrs?.src}
                                alt={block?.attrs?.alt || ""}
                                title={block?.attrs?.title || ""}
                                style={{ maxWidth: "100%", marginBottom: "1rem" }}
                            />
                        );
                    }

                    return null;
                })}
            </div>
        </MathJaxContext>
    );
}