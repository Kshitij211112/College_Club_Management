import { Routes, Route } from "react-router-dom";
import CertificateDesigner from "./pages/CertificateDesigner";
import CertificateGenerator from "./pages/CertificateGenerator";
import CertificateEditor from "./pages/CertificateEditor";
import ComposeEmail from "./pages/ComposeEmail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CertificateDesigner />} />
      <Route path="/design-editor" element={<CertificateEditor />} />
      <Route path="/generate" element={<CertificateGenerator />} />
      <Route path="/compose-email" element={<ComposeEmail />} />
    </Routes>
  );
}

export default App;
