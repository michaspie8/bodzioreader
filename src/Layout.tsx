import { Outlet, useLocation, useNavigate } from "react-router";

export default function Layout() {

  const navigate = useNavigate();
  const location = useLocation();

    return <div className="page">
      <header className="top-bar flex">
        <div className="brand text-xl font-bold">Bodzio reader</div>
        <div className="flex-grow-1 text-right">
          { location.pathname !== '/library' ? 
            <button className="text-muted text-sm cursor-pointer hover:text-text transition" onClick={() => {
              navigate('/library');
            }}>Return to library</button>
            : undefined
          }
        </div>
      </header>
      <Outlet />
    </div>

}