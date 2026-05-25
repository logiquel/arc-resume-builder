import React, { useEffect, useState } from "react";

interface AutoSaveNotificationProps {
  status: "saving" | "saved" | "error" | null;
  onClose: () => void;
}

export const AutoSaveNotification: React.FC<AutoSaveNotificationProps> = ({
  status,
  onClose,
}) => {
  useEffect(() => {
    if (status === "saved" || status === "error") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!status) return null;

  const getColors = () => {
    switch (status) {
      case "saving":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "saved":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
    }
  };

  const getText = () => {
    switch (status) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved ✓";
      case "error":
        return "Failed to save";
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50">
      <div
        className={`flex items-center px-4 py-2 rounded-lg border shadow-lg ${getColors()}`}
      >
        <span className="text-xs font-medium">{getText()}</span>
      </div>
    </div>
  );
};
