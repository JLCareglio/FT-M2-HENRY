import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [txtCiudad, setTxtCiudad] = useState("");
  const handleChange = (e) => (setTxtCiudad(e.target.value));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(txtCiudad);
      }}
    >
      <input type="text" placeholder="Ciudad..." onChange={handleChange} />
      <input type="submit" value="🔎" />
    </form>
  );
}
