import React, { useEffect, useState } from "react";

const TextEditor = () => {
  const [fonts, setFonts] = useState({});
  const [text, setText] = useState("");
  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  const [selectedFontWeight, setSelectedFontWeight] = useState("400");
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(`db.json`); 
        const data = await response.json();
        setFonts(data);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };

    fetchFonts();
  }, []);

  const handleFontFamilyChange = (e) => {
    setSelectedFontFamily(e.target.value);
    setSelectedFontWeight("400");
    setIsItalic(false);
  };

  const handleFontWeightChange = (e) => {
    setSelectedFontWeight(e.target.value);
  };

  const handleItalicChange = (e) => {
    setIsItalic(e.target.checked);
  };

  const fontsArray = Object.keys(fonts).map((font) => ({
    id: font,
    name: font,
  }));

  const fontVariants = selectedFontFamily
    ? Object.keys(fonts[selectedFontFamily])
    : [];

  const fontWeightOptions = fontVariants.filter(
    (variant) => !variant.includes("italic")
  );
  const hasItalicOption = fontVariants.some((variant) => variant.includes("italic"));

  const selectedVariant = isItalic
    ? `${selectedFontWeight}italic`
    : selectedFontWeight;
  const fontUrl = fonts[selectedFontFamily]?.[selectedVariant];

  useEffect(() => {
    if (fontUrl) {
      const style = document.createElement("style");
      style.innerHTML = `
        @font-face {
          font-family: '${selectedFontFamily}';
          font-weight: ${selectedFontWeight};
          font-style: ${isItalic ? "italic" : "normal"};
          src: url(${fontUrl}) format('woff2');
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [fontUrl, selectedFontFamily, selectedFontWeight, isItalic]);

  return (
    <div>
      <h1>Text Editor</h1>
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <select
          id="fontFamily"
          onChange={handleFontFamilyChange}
          value={selectedFontFamily}
          style={{ width: "200px" }}
        >
          {fontsArray.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
        <select
          id="fontWeight"
          onChange={handleFontWeightChange}
          value={selectedFontWeight}
          style={{ width: "200px" }}
        >
          {fontWeightOptions.map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
        {hasItalicOption && (
          <label>
            <input
              type="checkbox"
              checked={isItalic}
              onChange={handleItalicChange}
            />
            Italic
          </label>
        )}
      </div>
      <textarea
        style={{
          width: "95%",
          height: "20rem",
          borderRadius: "20px",
          padding: "10px",
          fontFamily: selectedFontFamily,
          fontWeight: selectedFontWeight,
          fontStyle: isItalic ? "italic" : "normal",
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default TextEditor;
