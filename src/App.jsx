import { Route, Routes } from "react-router-dom";
import "./App.css";
import ViewAudience from "./Modules/audience";
import MainLayout from "./Modules/layout";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<ViewAudience />} />
      </Route>
    </Routes>
  );
}
