import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";

import AppBody from "~/components/AppBody";

import { AuthProvider } from "./components/auth/AuthContext";

import { AppStateProvider } from "~/context/AppStateContext";

import Header from "~/components/Layout/Header";
import Sidebar from "~/components/Layout/Sidebar";

export default function App() {
  const [activePanel, setActivePanel] = useState(false);

  function setActivePanelEffect(value: boolean) {
    document.body.classList.toggle("global-sidebar-is-active");
    setActivePanel(value);
  }

  // Global Sidebar
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (activePanel && e.type === "keyup" && e.code === "Escape") {
        setActivePanelEffect(false);
      }
    }
    window.addEventListener("keyup", callback);
    return () => {
      window.removeEventListener("keyup", callback);
    };
  }, [activePanel]);

  return (
    <AuthProvider>
      <AppStateProvider>
        <HelmetProvider>
          <Header setActivePanel={setActivePanelEffect} />
          <Sidebar
            activePanel={activePanel}
            setActivePanel={setActivePanelEffect}
          />
          <AppBody />
        </HelmetProvider>
      </AppStateProvider>
    </AuthProvider>
  );
}
