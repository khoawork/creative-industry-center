import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header.jsx";
import Footer from "../../layout/Footer.jsx";
import { navigation, siteLinks } from "../../config/shared/site.js";
import NominationDialog from "../../components/RecordHolder/NominationDialog.jsx";
import RecordHolderBody from "../../components/RecordHolder/RecordHolderSections.jsx";
import "./RecordHolder.css";

export default function RecordHolder() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const closeDialog = useCallback(() => setSelectedAward(null), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function selectSection(event, href) {
    event.preventDefault();
    navigate(href);
    setMenuOpen(false);
  }

  return (
    <>
      <a
        className="sr-only fixed left-4 top-4 z-50 rounded bg-primary px-4 py-3 text-white focus:not-sr-only"
        href="#noi-dung"
      >
        Chuyển đến nội dung
      </a>
      <main id="noi-dung" tabIndex={-1} className="w-full bg-record-surface">
        <RecordHolderBody onNominate={setSelectedAward} />
      </main>
      {selectedAward && (
        <NominationDialog award={selectedAward} onClose={closeDialog} />
      )}
    </>
  );
}
