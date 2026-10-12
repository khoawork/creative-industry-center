import React from "react";
import { getIconComponent } from "./iconRegistry.js";

/**
 * Component hiển thị Icon động từ tên string của Lucide
 * @param {string} name - Tên icon Lucide (vd: "Award", "Calendar", "Trophy")
 * @param {number} size - Kích thước px (mặc định 18)
 * @param {string} className - Các lớp CSS bổ sung
 * @param {number} strokeWidth - Độ dày nét viền (mặc định 2)
 */
export default function DynamicIcon({
  name,
  size = 18,
  className = "",
  strokeWidth = 2,
  ...props
}) {
  const IconComponent = getIconComponent(name);
  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

