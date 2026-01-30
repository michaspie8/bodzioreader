import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Library from "./views/library.tsx";
import "./styles.css";
import "./globals.css"
import "./styles/buttons.css";
import { BrowserRouter } from "react-router";
import { Routes, Route } from "react-router";
import Layout from "./Layout.tsx";
import Book from "./views/book.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path="library" element={<Library />} />
          <Route path="book" element={<Book />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
