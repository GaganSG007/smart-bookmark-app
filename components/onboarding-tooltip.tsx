"use client";

import { useEffect, useState } from "react";

export default function OnboardingTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("sb_onboarding_seen");
      if (!seen) setVisible(true);
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem("sb_onboarding_seen", "1");
    } catch (e) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-50">
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📚</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Welcome to Smart Bookmarks</h3>
            <p className="text-gray-600 text-sm mt-1">Use the Add button to save links. Open/Copy/Delete actions appear when you hover a bookmark.</p>
            <div className="mt-3 flex justify-end">
              <button onClick={dismiss} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Got it</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
