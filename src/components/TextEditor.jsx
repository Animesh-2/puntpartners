import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";

const TextEditor = () => {
  const [fonts, setFonts] = useState({});
  const [text, setText] = useState("");
  const [selectedFontFamily, setSelectedFontFamily] = useState("");

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(`db.json`);
        const data = await response.json();
        setFonts(data);
        console.log(fonts);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };

    fetchFonts();
  }, []);

  const handleFontFamilyChange = (e) => {
    setSelectedFontFamily(e.target.value);
    console.log(selectedFontFamily);
  };

  const fontsArray = Object.keys(fonts).map((font) => ({
    id: font,
    name: font,
  }));
//   console.log(fontsArray);

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
          {/* Render options dynamically from fonts array */}
          {fontsArray.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
        <select id="fontWeight" style={{ width: "200px" }}>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          {/* Add other font weight options as needed */}
        </select>
      </div>
      <textarea
        style={{
          width: "95%",
          height: "20rem",
          borderRadius: "20px",
          padding: "10px",
          fontFamily: selectedFontFamily,
          
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default TextEditor;
