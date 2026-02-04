import React from "react";
import ReactDOM from "react-dom/client";
import Library from "./views/library.tsx";
import "./styles.css";
import "./globals.css"
import "./styles/buttons.css";
import { BrowserRouter } from "react-router";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./Layout.tsx";
import Book from "./views/book.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path="library" element={<Library />} />
          <Route path="book" element={<Book />} />
          <Route path="*" element={<Navigate to="/library" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
