import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import WebFont from "webfontloader";

const googleFonts = [
  "Poppins",
  "Roboto",
  "Montserrat",
  "Playfair Display",
  "Lato",
  "Open Sans",
  "Merriweather",
  "Nunito",
  "Raleway",
  "Ubuntu",
  "Oswald",
  "Source Sans Pro",
  "Slabo 27px",
  "PT Sans",
  "Lora",
];

const fontWeights = [300, 400, 500, 700, 900];

export default function DragDropEditor({ template, onSave, initialData }) {
  const [coords, setCoords] = useState(null);
  const [isReady, setIsReady] = useState(false); // To prevent flash before positioning
  
  // State for all styling options
  const [text, setText] = useState(initialData?.text || "Participant Name");
  const [fontFamily, setFontFamily] = useState(initialData?.fontFamily || "Poppins");
  const [fontSize, setFontSize] = useState(initialData?.fontSize || 42); // This will be adjusted on load if needed
  const [fontWeight, setFontWeight] = useState(initialData?.fontWeight || 400);
  const [color, setColor] = useState(initialData?.color || "#000000");
  const [isBold, setIsBold] = useState(initialData?.fontWeight >= 700 || false);
  const [isItalic, setIsItalic] = useState(initialData?.fontStyle === 'italic' || false);
  const [isUnderline, setIsUnderline] = useState(initialData?.textDecoration === 'underline' || false);
  const [alignment, setAlignment] = useState(initialData?.textAlign || "center");
  const [letterSpacing, setLetterSpacing] = useState(initialData?.letterSpacing || 0);
  const [lineHeight, setLineHeight] = useState(initialData?.lineHeight || 1.2);

  const containerRef = useRef(null);
  const nodeRef = useRef(null);

  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: "auto",
  });

  // Load Google Fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: googleFonts,
      },
    });
  }, []);

  // Update State if initialData changes (e.g. loaded later)
  useEffect(() => {
    if (initialData) {
        setText(initialData.text || "Participant Name");
        setFontFamily(initialData.fontFamily || "Poppins");
        setColor(initialData.color || "#000000");
        setIsBold(initialData.fontWeight >= 700);
        setFontWeight(initialData.fontWeight || 400);
        setIsItalic(initialData.fontStyle === 'italic');
        setIsUnderline(initialData.textDecoration === 'underline');
        setAlignment(initialData.textAlign || "center");
        setLetterSpacing(initialData.letterSpacing || 0);
        setLineHeight(initialData.lineHeight || 1.2);
        // fontSize is handled in handleImageLoad to account for scaling
    }
  }, [initialData]);

  // Calculate Preview Size & Restore Position
  const handleImageLoad = () => {
    const img = containerRef.current?.querySelector("img");
    if (!img) return;

    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    if (!naturalWidth || !naturalHeight) return;

    let maxWidth = 900;
    let maxHeight = 650;

    const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);

    const displayWidth = Math.round(naturalWidth * ratio);
    const displayHeight = Math.round(naturalHeight * ratio);

    setContainerStyle({
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
    });

    // DEFAULT POSITION (center - now top-left based)
    const initialX = displayWidth * 0.10;
    const initialY = displayHeight * 0.10;

    setCoords({ x: initialX, y: initialY });

    setIsReady(true);
  };


  // Adjust coordinates for Center Alignment (Mounting Phase)
  useEffect(() => {
    // Run this when not ready (just loaded or reset) and we have coords
    if (!isReady && coords && nodeRef.current) {
        const width = nodeRef.current.offsetWidth;
        const height = nodeRef.current.offsetHeight;

        // Shift from Center to Top-Left
        setCoords(prev => ({
            x: prev.x - (width / 2),
            y: prev.y - (height / 2)
        }));
        setIsReady(true); // Now we are visible and positioned
    }
  }, [coords, isReady]);

  /* 
     Update handleSave to use Ratio-Based Coordinates 
     xPercent = (textCenterX / canvasWidth)
     yPercent = (textCenterY / canvasHeight)
     finalX = xPercent * naturalWidth
     finalY = yPercent * naturalHeight
  */
  const handleSave = () => {
    if (!containerRef.current || !nodeRef.current) return;
    
    // Get displayed image dimensions
    const img = containerRef.current.querySelector('img');
    if (!img) return;

    // Get Container Rect (matches image display size)
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Get Text Rect (current position on screen)
    const textRect = nodeRef.current.getBoundingClientRect();
    
    // Calculate Relative Center Position
    // textRect keys are viewport-relative, so subtract container viewport position
    const relativeLeft = textRect.left - containerRect.left;
    const relativeTop = textRect.top - containerRect.top;
    
    // Calculate Center of Text Element
    const textCenterX = relativeLeft + (textRect.width / 2);
    const textCenterY = relativeTop + (textRect.height / 2);
    
    // Calculate Ratios (Percentage)
    const ratioX = textCenterX / containerRect.width;
    const ratioY = textCenterY / containerRect.height;
    
    // Get Natural Dimensions (Original Resolution)
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Calculate Font Scaling
    // scaleFactor = naturalHeight / displayHeight
    const scaleFactor = naturalHeight / containerRect.height;
    // We send BACKEND the scaled font (e.g. 100px), state keeps display font (e.g. 20px)
    const backendFontSize = fontSize * scaleFactor;

    // Convert to Final Absolute Coordinates for Export
    const finalX = ratioX * naturalWidth;
    const finalY = ratioY * naturalHeight;

    onSave({
      text,
      // Save Ratios (Primary Source of Truth)
      xPercent: ratioX,
      yPercent: ratioY,
      
      // Save Absolutes (For Backward Compat / Image Gen)
      x: finalX,
      y: finalY,
      
      fontSize: backendFontSize, // Scaled up!
      fontFamily,
      fontWeight: isBold ? 700 : fontWeight,
      color,
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      textAlign: alignment,
      letterSpacing,
      lineHeight,
      
      // Debug Metadata
      previewWidth: containerRect.width,
      previewHeight: containerRect.height,
      originalWidth: naturalWidth,
      originalHeight: naturalHeight
    });
  };

  // Handle image load effect safely
  useEffect(() => {
    // Force re-measure if template changes or on mount
    if (containerRef.current && containerRef.current.querySelector('img')) {
        const img = containerRef.current.querySelector('img');
        if (img.complete) {
            handleImageLoad({ target: img });
        }
    }
  }, [template]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-gray-50/50 text-gray-800 font-sans ">
      
      {/* --- LEFT PANEL: PREVIEW --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden relative">
        <div className="mb-4">
             <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest">Certificate Preview</h2>
        </div>
        
        <div
          ref={containerRef}
          className="relative shadow-2xl rounded-md bg-white border border-gray-200 flex items-center justify-center"
          style={{
            width: "900px",     // <<< FIXED PREVIEW WIDTH
            height: "650px",    // <<< FIXED PREVIEW HEIGHT
            position: "relative",
            overflow: "hidden",
          }}
        >
          {template ? (
            <img
              src={template}
              onLoad={handleImageLoad}
              alt="Certificate Template"
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Template Loaded</div>
          )}

          {coords && (
            <Draggable
                key={`${coords.x}-${coords.y}`}
                nodeRef={nodeRef}
                defaultPosition={coords}
                position={isReady ? coords : undefined}
                onStop={(e, d) => setCoords({ x: d.x, y: d.y })}
                bounds="parent"
            >
              <div
                ref={nodeRef}
                className="absolute cursor-move border-[2px] border-blue-500 border-dashed hover:border-blue-700 p-2 transition-colors whitespace-nowrap z-50 bg-white/30 backdrop-blur-sm rounded opacity-100"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  fontWeight: isBold ? 700 : fontWeight,
                  color: color,
                  fontStyle: isItalic ? "italic" : "normal",
                  textDecoration: isUnderline ? "underline" : "none",
                  textAlign: alignment,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineHeight,
                  // We let Draggable handle Left/Top via transform
                }}
              >
                {text}
              </div>
            </Draggable>
          )}
        </div>
        <p className="mt-6 text-gray-400 text-sm">Drag the text to position it.</p>
      </div>

       {/* --- RIGHT PANEL: TEXT STYLING SIDEBAR --- */}
      <div className="w-full lg:w-[400px] h-full bg-white border-l border-gray-200 shadow-xl flex flex-col overflow-y-auto z-20">
        
        {/* <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Text Styling</h2>
          <p className="text-gray-400 text-xs mt-1">Customize the appearance of your variables.</p>
        </div> */}

        <div className="p-4 space-y-8">
            
            {/* 0. Text Content */}
             <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Text Content</label>
                <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
            </div>

            {/* 1. Font Family */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Font Family</label>
                <div className="relative">
                    <select 
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                        style={{fontFamily}}
                    >
                        {googleFonts.map(font => (
                            <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
            </div>

            {/* 2. Font Size & Weight */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size (px)</label>
                    <input 
                        type="number" 
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 text-center focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>
                 <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weight</label>
                    <div className="relative">
                        <select 
                            value={fontWeight}
                            onChange={(e) => setFontWeight(Number(e.target.value))}
                            className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                        >
                            {fontWeights.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                    </div>
                </div>
            </div>
            {/* Slider for Size */}
            <input 
                type="range" 
                min="10" 
                max="200" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />

            {/* 3. Color & Toggles */}
            <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color</label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden p-1 gap-2 items-center">
                        <input 
                            type="color" 
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 border-none p-0 bg-transparent cursor-pointer rounded"
                        />
                        <input 
                            type="text" 
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full text-xs font-mono bg-transparent outline-none text-gray-600 uppercase"
                        />
                    </div>
                </div>

                {/* Style Toggles */}
                <div className="flex gap-1 justify-between bg-gray-50 p-1 rounded-xl border border-gray-200">
                    <button 
                        onClick={() => setIsBold(!isBold)}
                        className={`p-2 rounded-lg flex-1 font-bold transition-colors ${isBold ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                    >B</button>
                    <button 
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-2 rounded-lg flex-1 italic transition-colors ${isItalic ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                    >I</button>
                    <button 
                        onClick={() => setIsUnderline(!isUnderline)}
                        className={`p-2 rounded-lg flex-1 underline transition-colors ${isUnderline ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                    >U</button>
                </div>
            </div>

            
            
            {/* 5. Typography Details */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                    <div className="flex justify-between">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Letter Spacing</label>
                         <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 rounded">{letterSpacing}px</span>
                    </div>
                    <input 
                        type="range" 
                        min="-2" 
                        max="10" 
                        step="0.5"
                        value={letterSpacing} 
                        onChange={(e) => setLetterSpacing(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                
            </div>

        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="p-6 mt-auto bg-gray-50 border-t border-gray-200">
             <button
                onClick={handleSave}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <span>Save Design</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>

      </div>
    </div>
  );
}
