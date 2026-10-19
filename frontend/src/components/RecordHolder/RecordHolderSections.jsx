import { useState, useEffect } from "react";
import { RecordAPI } from "../../api/recordsApi";
import RecordHeader from "./RecordHeader";
import RecordGovernance from "./RecordGovernance";
import RecordList from "./RecordList";
import RecordHonorRoll from "./RecordHonorRoll";
import RecordProcess from "./RecordProcess";

export default function RecordHolderBody({ onNominate }) {
  const [filter, setFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [governanceData, setGovernanceData] = useState(null);
  const [honorRollsData, setHonorRollsData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [recordsConfig, setRecordsConfig] = useState({
    title: "",
    subtitle: "",
  });
  const [error, setError] = useState(null);

  function onDownloadDoc(docUrlOrName, recordTitle) {
    if (!docUrlOrName) {
      window.alert(
        `Hồ sơ tiêu chí đề cử cho hạng mục "${recordTitle || "này"}" đang được cập nhật.`
      );
      return;
    }

    const isHttp =
      docUrlOrName.startsWith("http://") ||
      docUrlOrName.startsWith("https://") ||
      docUrlOrName.startsWith("/");

    if (isHttp) {
      let downloadUrl = docUrlOrName;
      // If Cloudinary URL, inject fl_attachment to force direct file download
      if (
        downloadUrl.includes("res.cloudinary.com") &&
        !downloadUrl.includes("fl_attachment")
      ) {
        downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const filename =
        docUrlOrName.split("/").pop() ||
        `${recordTitle ? recordTitle.replace(/\s+/g, "_") : "Ho_So_Tieu_Chi"}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.alert(
        `Tài liệu "${docUrlOrName}" đang được hoàn thiện cập nhật trên hệ thống.`
      );
    }
  }

  useEffect(() => {
    async function fetchPageData() {
      try {
        // Gọi đồng thời tất cả các API, bao gồm cả getCtaList riêng biệt và getPageBySlug
        const [headerRes, govRes, ctaRes, itemsRes, honorsRes, processRes, pageRes] = await Promise.allSettled([
          RecordAPI.getHeader(),
          RecordAPI.getGovernance(),
          RecordAPI.getCtaList(), // API riêng cho danh sách CTA
          RecordAPI.getRecords(),
          RecordAPI.getHonorRolls(),
          RecordAPI.getProcess(),
          RecordAPI.getPageBySlug("records"),
        ]);

        const headerVal = headerRes.status === "fulfilled" ? (headerRes.value.data || headerRes.value) : null;
        const govVal = govRes.status === "fulfilled" ? (govRes.value.data || govRes.value) : null;
        const ctaVal = ctaRes.status === "fulfilled" ? (ctaRes.value.data || ctaRes.value) : [];
        const itemsVal = itemsRes.status === "fulfilled" ? (itemsRes.value.data || itemsRes.value) : [];
        const honorsVal = honorsRes.status === "fulfilled" ? (honorsRes.value.data || honorsRes.value) : null;
        const processVal = processRes.status === "fulfilled" ? (processRes.value.data || processRes.value) : null;
        const pageVal = pageRes.status === "fulfilled" ? (pageRes.value.data || pageRes.value) : null;

        const pageProps = pageVal?.props || {};

        setHeaderData(headerVal || pageProps.header || null);
        
        // Gộp dữ liệu CTA vào object governance nếu trong gov chưa có sẵn cta
        const finalGov = govVal || pageProps.governance || {};
        const finalCtas = (finalGov?.cta && finalGov.cta.length > 0) ? finalGov.cta : (Array.isArray(ctaVal) ? ctaVal : []);
        setGovernanceData({
          ...finalGov,
          cta: finalCtas
        });

        // Xử lý danh sách kỷ lục được chọn hiển thị:
        // Nếu pageProps có cấu hình selected_record_ids (danh sách ID được chọn hiển thị)
        const allItems = Array.isArray(itemsVal) && itemsVal.length > 0 ? itemsVal : (pageProps.records || []);
        const selectedIds = pageProps.selected_record_ids;

        if (Array.isArray(selectedIds) && selectedIds.length > 0) {
          const selectedSet = new Set(selectedIds.map(String));
          setRecords(allItems.filter((r) => selectedSet.has(String(r.id))));
        } else {
          setRecords(allItems);
        }
        
        const honorsList = honorsVal || pageProps.honor_rolls || null;
        setHonorRollsData(honorsList);
        
        setProcessData(processVal || pageProps.process || null);
        setRecordsConfig({
          title: pageProps.record_section_title ,
          subtitle: pageProps.record_section_subtitle,
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang Kỷ lục:", err);
        setError(err.message || "Lỗi tải dữ liệu hệ thống");
      }
    }

    fetchPageData();
  }, []);

  return (
    <div className="record-holder-page flex w-full flex-col" data-filter={filter}>
      <RecordHeader header={headerData} />
      <RecordGovernance governance={governanceData} />
      <RecordList
        records={records}
        title={recordsConfig.title}
        subtitle={recordsConfig.subtitle}
        error={error}
        onNominate={onNominate}
        onDownloadDoc={onDownloadDoc}
      />
      <RecordHonorRoll
        honorRoll={honorRollsData}
        filter={filter}
        setFilter={setFilter}
      />
      <RecordProcess process={processData} />
    </div>
  );
}