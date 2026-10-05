import React, { useState, useEffect, useMemo } from "react";
import ProjectHeader from "./project-header";
import ProjectFilter from "./project-filter";
import ProjectCard from "./project-card";
import ProjectForm from "./project-form";
import { ProjectPageAPI } from "../../api/projectPageApi.js";
import { ProjectAPI } from "../../api/projectApi.js";
import { RefreshCw } from "lucide-react";

export default function ProjectLayout() {
  const [activeCategory, setActiveCategory] = useState("Tất cả dự án");
  const [pageData, setPageData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      ProjectPageAPI.getProjectPage(5).catch((err) => {
        console.warn("Lỗi khi tải cấu hình trang Dự án:", err);
        return null;
      }),
      ProjectAPI.getProjects().catch((err) => {
        console.warn("Lỗi khi tải danh sách dự án từ database:", err);
        return null;
      }),
      ProjectAPI.getCategories().catch((err) => {
        console.warn("Lỗi khi tải danh mục dự án từ database:", err);
        return null;
      }),
    ])
      .then(([pageRes, projectsRes, categoriesRes]) => {
        if (!isMounted) return;

        // 1. Unwrap page data
        const pData = pageRes?.data || pageRes;
        if (pData) setPageData(pData);

        // 2. Unwrap projects from database table `project`
        const pList = Array.isArray(projectsRes?.data)
          ? projectsRes.data
          : Array.isArray(projectsRes)
          ? projectsRes
          : [];
        setProjects(pList);

        // 3. Unwrap categories
        const cList = Array.isArray(categoriesRes?.data)
          ? categoriesRes.data
          : Array.isArray(categoriesRes)
          ? categoriesRes
          : [];
        setCategories(cList);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc danh sách dự án được quản trị viên chọn hiển thị (hoặc toàn bộ nếu chưa chọn)
  const displayableProjects = useMemo(() => {
    const selectedIds = pageData?.props?.selected_project_ids;
    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
      const allowedSet = new Set(selectedIds.map(Number));
      return projects.filter((p) => allowedSet.has(Number(p.id)));
    }
    return projects;
  }, [projects, pageData]);

  // Tính toán danh sách danh mục kèm số lượng dự án từ database
  const filterCategories = useMemo(() => {
    const list = [
      {
        name: "Tất cả dự án",
        count: displayableProjects.length < 10 ? `0${displayableProjects.length}` : String(displayableProjects.length),
      },
    ];

    if (categories.length > 0) {
      categories.forEach((cat) => {
        const count = displayableProjects.filter(
          (p) => p.category_id === cat.id || p.category?.name === cat.name
        ).length;
        if (count > 0) {
          list.push({
            name: cat.name,
            count: count < 10 ? `0${count}` : String(count),
          });
        }
      });
    } else {
      // Nhóm theo category của project nếu category API chưa có
      const uniqueNames = new Set(
        displayableProjects.map((p) => p.category?.name || p.categoryTag).filter(Boolean)
      );
      uniqueNames.forEach((catName) => {
        const count = displayableProjects.filter(
          (p) => (p.category?.name || p.categoryTag) === catName
        ).length;
        list.push({
          name: catName,
          count: count < 10 ? `0${count}` : String(count),
        });
      });
    }

    return list;
  }, [displayableProjects, categories]);

  // Lọc danh sách dự án hiển thị dựa theo danh mục được chọn
  const filteredProjects = useMemo(() => {
    if (activeCategory === "Tất cả dự án") return displayableProjects;
    return displayableProjects.filter(
      (p) =>
        p.category?.name === activeCategory ||
        p.categoryTag === activeCategory ||
        categories.find((c) => c.name === activeCategory)?.id === p.category_id
    );
  }, [displayableProjects, activeCategory, categories]);

  return (
    <div className="max-w pb-16">
      {/* 1. Phần Header nội dung trang (lấy từ page props) */}
      <ProjectHeader headerData={pageData?.props?.header_section} />

      {/* 2. Phần Bộ lọc danh mục dự án */}
      <ProjectFilter
        categories={filterCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 3. Danh sách các Card dự án từ cơ sở dữ liệu */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500 gap-3">
          <RefreshCw className="animate-spin text-[#710008]" size={24} />
          <span>Đang nạp danh sách dự án từ cơ sở dữ liệu...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-xl mx-6 md:mx-20 border border-gray-200">
          <p className="text-gray-500 text-base">
            Không tìm thấy dự án nào trong mục "{activeCategory}".
          </p>
        </div>
      ) : (
        <div className="px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 4. Phần Form đề xuất dự án (lấy từ page props) */}
      <ProjectForm formData={pageData?.props?.proposal_section} />
    </div>
  );
}
