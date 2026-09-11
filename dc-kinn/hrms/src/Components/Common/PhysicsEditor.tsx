import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from "react-konva";
import UpdatedHorizontalTab from "./UpdatedHorizontalTab"; // Assuming this path is correct
import { SelectInput } from "."; // Assuming this path is correct
import { useFormik } from "formik";
import { generateUniqueNumber } from "../../utility/commonutility";
import Konva from "konva";

// --- TYPES ---
type CanvasImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
};

type CanvasText = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
};

// --- YOUR ORIGINAL DATA ---
const physicsIcons = {
  Mechanics: [
    {
      id: "pulley",
      label: "Pulley",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/19/1674157989_Phy_13b21f65-1f9b-49ec-8669-66a484525c30.jpeg",
    },
    {
      id: "spring",
      label: "Spring",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/25/1674622690_Phy_f955233b-f363-4d38-aca7-fb6b6e71052b.jpeg",
    },
    {
      id: "pully",
      label: "Pully",
      src: "https://mscontent-gcp.extramarks.com/stryde/2024/8/1/1722483021.jpeg",
    },
    {
      id: "friction",
      label: "Friction",
      src: "https://mscontent-gcp.extramarks.com/stryde/2024/8/1/1722524170.jpeg",
    },
    {
      id: "friction2",
      label: "Friction2",
      src: "https://mscontent-gcp.extramarks.com/physics_editor/svg/2023/1/12/1673508759_Untitled-1.svg",
    },
    {
      id: "friction3",
      label: "Friction3",
      src: "https://mscontent-gcp.extramarks.com/physics_editor/svg/2023/1/12/1673510353_Untitled-3.svg",
    },
  ],
  Optics: [
    {
      id: "lens",
      label: "Lens",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/12/1673546310_Phy_c1e0da00-30c8-43b9-a1a6-62fb1426abbd.jpeg",
    },
    {
      id: "round",
      label: "round",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/24/1674537921_Phy_77507fc5-7ae7-490a-aaa6-b00211564782.jpeg",
    },
  ],
  "Electricity and Magnetism": [
    {
      id: "battery",
      label: "Battery",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/17/1673976965_Phy_72890ce1-f8dd-467c-997e-020605b111a5.jpeg",
    },
  ],
  "General Shapes": [
    {
      id: "circle",
      label: "circle",
      src: "https://mscontent-gcp.extramarks.com/stryde/2023/1/24/1674537921_Phy_77507fc5-7ae7-490a-aaa6-b00211564782.jpeg",
    },
  ],
};

const physicsCategories = [
  { id: "Mechanics", physicsIconsNames: "Mechanics" },
  { id: "Optics", physicsIconsNames: "Optics" },
  { id: "Electricity and Magnetism", physicsIconsNames: "Electricity and Magnetism" },
  { id: "General Shapes", physicsIconsNames: "General Shapes" },
  { id: "Symbols", physicsIconsNames: "Symbols" },
];


// --- CUSTOM HOOK ---
export function useImage(url: string): [HTMLImageElement | null] {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const nativeImg = new window.Image();
    nativeImg.crossOrigin = "Anonymous";
    nativeImg.src = url;
    nativeImg.onload = () => setImage(nativeImg);
  }, [url]);
  return [image];
}

// --- TRANSFORMABLE IMAGE COMPONENT ---
const TransformableImage = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  const shapeRef = React.useRef<Konva.Image>(null);
  const [image] = useImage(shapeProps.src);

  return (
    <KonvaImage
      ref={shapeRef}
      {...shapeProps}
      image={image}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY),
          rotation: node.rotation(),
        });
      }}
    />
  );
};

// --- MAIN EDITOR COMPONENT ---
type PhysicsEditorProps = { stageRef: React.RefObject<Konva.Stage>, transformerRef: React.RefObject<Konva.Transformer>, layerRef: React.RefObject<Konva.Layer> };

const PhysicsEditor: React.FC<PhysicsEditorProps> = ({ stageRef, transformerRef, layerRef }) => {
  const dragUrl = React.useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null); 

  // State
  const [activeTab, setActiveTab] = useState("images");
  const [canvasImages, setCanvasImages] = useState<CanvasImage[]>([]);
  const [textItems, setTextItems] = useState<CanvasText[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const textEditRef = useRef<HTMLTextAreaElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const formik = useFormik({
    initialValues: { category: "" },
    onSubmit: () => { },
  });

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    if (transformerRef.current) {
      const selectedNode = stageRef.current?.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
      } else {
        transformerRef.current.nodes([]);
      }
      layerRef.current?.batchDraw();
    }
  }, [selectedId, layerRef, stageRef, transformerRef]);

  useEffect(() => {
    if (editingTextId) {
      textEditRef.current?.focus();
    }
  }, [editingTextId]);

  // --- ACTION HANDLERS ---
  const handleDelete = () => {
    if (!selectedId) return;
    setCanvasImages(canvasImages.filter(img => img.id !== selectedId));
    setTextItems(textItems.filter(txt => txt.id !== selectedId));
    setSelectedId(null);
  };

  const handleCopy = () => {
    if (!selectedId) return;
    const image = canvasImages.find(img => img.id === selectedId);
    if (image) {
      const newImage = { ...image, id: generateUniqueNumber(), x: image.x + 10, y: image.y + 10 };
      setCanvasImages([...canvasImages, newImage]);
      setSelectedId(newImage.id);
      return;
    }
    const text = textItems.find(txt => txt.id === selectedId);
    if (text) {
      const newText = { ...text, id: generateUniqueNumber(), x: text.x + 10, y: text.y + 10 };
      setTextItems([...textItems, newText]);
      setSelectedId(newText.id);
    }
  };

  const handleBringToFront = () => {
    if (!selectedId) return;
    const imageIndex = canvasImages.findIndex(img => img.id === selectedId);
    if (imageIndex > -1) {
      const item = canvasImages[imageIndex];
      const newImages = [...canvasImages];
      newImages.splice(imageIndex, 1);
      newImages.push(item);
      setCanvasImages(newImages);
      return;
    }
    const textIndex = textItems.findIndex(txt => txt.id === selectedId);
    if (textIndex > -1) {
      const item = textItems[textIndex];
      const newTexts = [...textItems];
      newTexts.splice(textIndex, 1);
      newTexts.push(item);
      setTextItems(newTexts);
    }
  };

  const handleSendToBack = () => {
    if (!selectedId) return;
    const imageIndex = canvasImages.findIndex(img => img.id === selectedId);
    if (imageIndex > -1) {
      const item = canvasImages[imageIndex];
      const newImages = [...canvasImages];
      newImages.splice(imageIndex, 1);
      newImages.unshift(item);
      setCanvasImages(newImages);
      return;
    }
    const textIndex = textItems.findIndex(txt => txt.id === selectedId);
    if (textIndex > -1) {
      const item = textItems[textIndex];
      const newTexts = [...textItems];
      newTexts.splice(textIndex, 1);
      newTexts.unshift(item);
      setTextItems(newTexts);
    }
  };

  const handleDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setEditingTextId(null);
    }
  };

  const addTextToCanvas = () => {
    const newId = generateUniqueNumber();
    const newItem: CanvasText = { id: newId, text: "Double-click to edit", x: 150, y: 150, fontSize: 20, width: 200 };
    setTextItems([...textItems, newItem]);
    setSelectedId(newId);
  };

  const handleTabChange = (tabId: string | null) => {
    setActiveTab(tabId || "images");
    if (activeTab === 'images' && tabId !== 'images') {
        formik.setFieldValue("category", "");
    }
  };

  const handleTextEdit = () => {
    if (editingTextId) {
      const updatedItems = textItems.map((item) =>
        item.id === editingTextId ? { ...item, text: inputValue } : item
      );
      setTextItems(updatedItems);
      setEditingTextId(null);
      setInputValue("");
    }
  };

  const selectedCategory = formik.values.category as keyof typeof physicsIcons;

  return (
    <div className="d-flex" style={{ height: '60vh', overflow: 'hidden', border: '2px solid #dee2e6' }}>
      {/* Left Panel */}
      <div className="d-flex flex-column" style={{ width: '350px', borderRight: '1px solid #dee2e6', padding: '1rem' }}>
        <UpdatedHorizontalTab
          MenuOptions={[
            { id: "images", labelName: "Images", customPadding: "10px" },
            { id: "text", labelName: "Text", customPadding: "10px" },
            { id: "templates", labelName: "Templates", customPadding: "10px" },
            { id: "repository", labelName: "Repository", customPadding: "10px" },
          ]}
          clickMenuHandler={(e) => handleTabChange(e.currentTarget.getAttribute("data-id"))}
          horizontalClass="horizontal-menu-updated-style super-admin-tabs"
          activeTabId={activeTab}
        />

        {activeTab === 'images' && (
          <>
            <div className="mt-3">
              <SelectInput
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                menuItems={physicsCategories}
                valueKey="id"
                textKey="physicsIconsNames"
                labelText="Category"
                floatingLabel
              />
            </div>
            
            {/* --- MODIFICATION IS INSIDE THIS BLOCK --- */}
            {!formik.values.category ? (
              <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                <p style={{ color: '#ccc', textAlign: 'center', fontSize: '1rem' }}>
                  Select Category
                </p>
              </div>
            ) : (
              // This logic now checks if the category has items before trying to display them.
              (physicsIcons[selectedCategory] && physicsIcons[selectedCategory].length > 0) ? (
                <div className="mt-3 row row-cols-1 row-cols-lg-2" style={{ overflowY: 'auto' }}>
                  {physicsIcons[selectedCategory].map((item) => (
                    <div key={item.id} className="text-center mb-2">
                      <img
                        src={item.src}
                        width={170}
                        alt={item.label}
                        draggable
                        onDragStart={() => { dragUrl.current = item.src; }}
                        style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '2px', cursor: 'grab', minHeight: "100px", maxHeight: '100px' }}
                      />
                      <div className="mt-1 small">{item.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                  <p style={{ color: '#ccc', textAlign: 'center', fontSize: '1rem' }}>
                    No items available in this category.
                  </p>
                </div>
              )
            )}
            {/* --- END MODIFICATION --- */}
          </>
        )}

        {activeTab === 'text' && (
          <div className="mt-3 p-2">
            <button onClick={addTextToCanvas} className="btn btn-primary w-100">
              Add Text Box
            </button>
            <p className="text-muted small mt-2 text-center">
              Click the button to add text. Double-click text on the canvas to edit.
            </p>
          </div>
        )}

        {activeTab === 'templates' && (
            <div className="mt-3 p-2 text-center text-muted">
                <p>Templates content will appear here.</p>
            </div>
        )}

        {activeTab === 'repository' && (
            <div className="mt-3 p-2 text-center text-muted">
                <p>Repository content will appear here.</p>
            </div>
        )}
      </div>

      {/* Right Panel Canvas Area */}
      <div
        ref={containerRef}
        className="flex-grow-1 position-relative"
        style={{ backgroundColor: '#f0f0f0' }}
        onDrop={(e) => {
          e.preventDefault();
          if (!dragUrl.current || !stageRef.current) return;
          stageRef.current.setPointersPositions(e);
          const pos = stageRef.current.getPointerPosition();
          if (!pos) return;
          const newImage: CanvasImage = {
            id: generateUniqueNumber(),
            src: dragUrl.current,
            x: pos.x,
            y: pos.y,
            width: 150,
            height: 150,
            rotation: 0,
          };
          setCanvasImages([...canvasImages, newImage]);
          dragUrl.current = null;
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '8px' }}>
          <button onClick={handleBringToFront} className="btn btn-white btn-md tw-color-black">Bring to Front</button>
          <button onClick={handleSendToBack} className="btn btn-white btn-md tw-color-black">Send to Back</button>
          <button onClick={handleCopy} className="btn btn-white btn-md tw-color-black">Copy</button>
          <button onClick={handleDelete} className="btn btn-danger btn-md tw-color-black">Delete</button>
        </div>
        
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          onMouseDown={handleDeselect}
          onTouchStart={handleDeselect}
        >
          <Layer ref={layerRef}>
            {canvasImages.map((img) => (
              <TransformableImage
                key={img.id}
                shapeProps={img}
                isSelected={img.id === selectedId && !editingTextId}
                onSelect={() => { setSelectedId(img.id); setEditingTextId(null); }}
                onChange={(newAttrs: CanvasImage) => {
                  const imgs = canvasImages.map(i => (i.id === newAttrs.id ? newAttrs : i));
                  setCanvasImages(imgs);
                }}
              />
            ))}
            {textItems.map((item, index) => (
              <Text
                key={index}
                {...item}
                id={item.id}
                visible={editingTextId !== item.id}
                draggable
                onClick={() => { setSelectedId(item.id); setEditingTextId(null); }}
                onTap={() => { setSelectedId(item.id); setEditingTextId(null); }}
                onDblClick={() => {
                  setEditingTextId(item.id);
                  setInputValue(item.text);
                  setSelectedId(null);
                }}
                onDblTap={() => {
                  setEditingTextId(item.id);
                  setInputValue(item.text);
                  setSelectedId(null);
                }}
                onDragEnd={(e) => {
                  const updated = textItems.map(t =>
                    t.id === item.id ? { ...t, x: e.target.x(), y: e.target.y() } : t
                  );
                  setTextItems(updated);
                }}
              />
            ))}
            {selectedId && <Transformer ref={transformerRef} flipEnabled={false} />}
          </Layer>
        </Stage>
        {editingTextId && (
          <textarea
            ref={textEditRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleTextEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextEdit();
              }
            }}
            style={{
              position: 'absolute',
              top: `${textItems.find(t => t.id === editingTextId)?.y}px`,
              left: `${textItems.find(t => t.id === editingTextId)?.x}px`,
              width: `${textItems.find(t => t.id === editingTextId)?.width}px`,
              fontSize: `${textItems.find(t => t.id === editingTextId)?.fontSize}px`,
              border: '1px solid #666',
              margin: '0',
              padding: '2px',
              resize: 'none',
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PhysicsEditor;