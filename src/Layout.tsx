import { Outlet } from "react-router";

export default function Layout() {

    return <div className="page">
      <header className="top-bar">
        <div className="brand">Fast Reading</div>
      </header>
      <Outlet />
    </div>

}