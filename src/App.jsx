/*import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";


function App() {
  const { pathname } = useLocation();

  return (
    <>
      {!(pathname == '/sign-in' || pathname == '/sign-up') && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={routes} />
        </div>
      )
      }
      <Routes>
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
       

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;*/
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";

function App() {
  const { pathname } = useLocation();

  const hideNavbar = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      {!hideNavbar && (
        <div className="container fixed top-0 left-1/2 z-10 -translate-x-1/2 p-4">

          <Navbar routes={routes} />
        </div>
      )}

      <Routes>
        {routes.map(({ path, element }, key) =>
          element ? <Route key={key} path={path} element={element} /> : null
        )}

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
