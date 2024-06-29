import React, { useEffect, useState } from "react";

const TextEditor = () => {
  const [fonts, setFonts] = useState({});
  const [text, setText] = useState("");
  const [selectedFontFamily, setSelectedFontFamily] = useState("");
  const [selectedFontWeight, setSelectedFontWeight] = useState("");
  const [isItalic, setIsItalic] = useState(false);

  // Function to load saved data from local storage
  useEffect(() => {
    const savedText = localStorage.getItem("text");
    const savedFontFamily = localStorage.getItem("selectedFontFamily");
    const savedFontWeight = localStorage.getItem("selectedFontWeight");
    const savedIsItalic = localStorage.getItem("isItalic");

    if (savedText) setText(savedText);
    if (savedFontFamily) setSelectedFontFamily(savedFontFamily);
    if (savedFontWeight) setSelectedFontWeight(savedFontWeight);
    if (savedIsItalic) setIsItalic(savedIsItalic === "true");
  }, []);

  // Function to save data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("text", text);
    localStorage.setItem("selectedFontFamily", selectedFontFamily);
    localStorage.setItem("selectedFontWeight", selectedFontWeight);
    localStorage.setItem("isItalic", isItalic.toString());
  }, [text, selectedFontFamily, selectedFontWeight, isItalic]);

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

  const handleReset = () => {
    setText("");
    setSelectedFontFamily("");
    setSelectedFontWeight("");
    setIsItalic(false);

    localStorage.clear();
  };

  const fontsArray = Object.keys(fonts).map((font) => ({
    id: font,
    name: font,
  }));

  let fontVariants = [];
  let fontWeightOptions = [];
  let hasItalicOption = false;
  let fontUrl = "";

  if (fonts[selectedFontFamily]) {
    fontVariants = Object.keys(fonts[selectedFontFamily]);
    fontWeightOptions = fontVariants.filter(
      (variant) => !variant.includes("italic")
    );
    hasItalicOption = fontVariants.some((variant) =>
      variant.includes("italic")
    );

    const selectedVariant = isItalic
      ? `${selectedFontWeight}italic`
      : selectedFontWeight;
    fontUrl = fonts[selectedFontFamily]?.[selectedVariant];
  }

  useEffect(() => {
    if (fontUrl && selectedFontFamily) {
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
        <label>
          Font Family
          <select
            id="fontFamily"
            onChange={handleFontFamilyChange}
            value={selectedFontFamily}
            style={{ width: "200px", margin: "0 5px" }}
          >
            {fontsArray.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Variant
          <select
            id="fontWeight"
            onChange={handleFontWeightChange}
            value={selectedFontWeight}
            style={{ width: "200px", margin: "0 5px" }}
          >
            {fontWeightOptions.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </label>
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
      <button onClick={handleReset}>RESET</button>
    </div>
  );
};

export default TextEditor;
