import React, { useState, useEffect, useMemo } from "react";
import TrainingLayout from "../../components/Training/TrainingLayout";
import HeroSection from "../../components/Training/HeroSection";
import TrainingModels from "../../components/Training/TrainingModels";
import TrainingSection from "../../components/Training/TrainingSection";
import CertificationSection from "../../components/Training/CertificationSection";
import { TrainingPageAPI } from "../../api/trainingPageApi.js";
import { TrainingAPI } from "../../api/trainingApi.js";

export default function TrainingPage() {

  const [pageData, setPageData] = useState(null);
  const [allTrainings, setAllTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      TrainingPageAPI.getTrainingPage(9).catch((err) => {
        console.error("Lỗi khi tải thông tin trang Đào tạo:", err);
        return null;
      }),
      TrainingAPI.getTrainings({ per_page: 100 }).catch((err) => {
        console.error("Lỗi khi tải danh sách khóa học:", err);
        return null;
      }),
    ]).then(([pageRes, trainingsRes]) => {
      if (!isMounted) return;

      if (pageRes && pageRes.data) {
        setPageData(pageRes.data);
      }

      const list = Array.isArray(trainingsRes?.data)
        ? trainingsRes.data
        : Array.isArray(trainingsRes)
        ? trainingsRes
        : [];
      setAllTrainings(list);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc chỉ hiển thị các khóa học được Admin chọn trong selected_training_ids
  const displayTrainings = useMemo(() => {
    const selectedIds = pageData?.props?.selected_training_ids;
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return allTrainings;
    }
    const selectedSet = new Set(selectedIds.map(String));
    return allTrainings.filter((tr) => selectedSet.has(String(tr.id)));
  }, [allTrainings, pageData]);

  const headerData = pageData?.props?.header_section;
  const modelsData = pageData?.props?.models_section || [];
  const certificationData = pageData?.props?.certification_section;


  if (loading) {
    return (
      <TrainingLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-sm text-gray-500 animate-pulse">
            Đang tải dữ liệu chương trình Hợp tác &amp; Đào tạo từ cơ sở dữ liệu...
          </div>
        </div>
      </TrainingLayout>
    );
  }

  return (
    <TrainingLayout>
      {/* 1. Banner & Thống kê */}
      <HeroSection headerData={headerData} />

      {/* 2. Các mô hình hợp tác (từ database) */}
      <TrainingModels models={modelsData} />

      {/* 3. Danh sách các khóa đào tạo được chọn lọc từ DB */}
      <TrainingSection trainings={displayTrainings} />

      {/* 4. Khối Cam kết chất lượng & Chứng nhận */}
      <CertificationSection certificationData={certificationData} />

    </TrainingLayout>
  );
}