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
    title: "DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC",
    subtitle: "DANH MỤC ĐỀ CỬ KỶ LỤC",
  });
  const [error, setError] = useState(null);

  function onDownloadDoc(filename) {
    window.alert(`Tài liệu ${filename} chưa được cung cấp.`);
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
        setHonorRollsData(Array.isArray(honorsList) ? honorsList[0] : honorsList);
        
        setProcessData(processVal || pageProps.process || null);
        setRecordsConfig({
          title: pageProps.record_section_title || "DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC",
          subtitle: pageProps.record_section_subtitle || "DANH MỤC ĐỀ CỬ KỶ LỤC",
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