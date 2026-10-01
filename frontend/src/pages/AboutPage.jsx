import { useEffect, useState } from "react";
import AboutLayout from "../components/About/about-layout";
import { IntroduceAPI } from "../api/introduceApi.js";
import { INTRODUCE_PAGE_ID } from "../config/About/aboutConfig.js";

export default function AboutPage() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: "loading", sections: {}, error: "" });

  useEffect(() => {
    const controller = new AbortController();

    IntroduceAPI.getIntroducePage(INTRODUCE_PAGE_ID, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const page = response?.data;
        if (response?.success !== true || !page?.props || typeof page.props !== 'object' || Array.isArray(page.props)) {
          throw new Error(response?.message || 'Dữ liệu trang giới thiệu không hợp lệ.');
        }
        setState({ status: "success", sections: page.props, error: "" });
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === "AbortError") return;
        setState({ status: "error", sections: {}, error: error.response?.data?.message || error.message || 'Không thể tải nội dung giới thiệu.' });
      });

    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ status: "loading", sections: {}, error: "" });
    setAttempt((current) => current + 1);
  }

  const hasContent = state.status === "success" && Object.keys(state.sections).length > 0;

  return (
    <div className="min-h-screen bg-[#f4f3f1] [font-family:Inter,sans-serif] antialiased text-black">
      <main className="w-full min-h-[calc(100vh-6rem)]" aria-busy={state.status === "loading"}>
        {hasContent ? (
          <AboutLayout props={state.sections} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-[#710008]">Giới thiệu</h1>
            {state.status === "error" ? (
              <p role="alert" className="break-words text-[#710008]">{state.error}</p>
            ) : (
              <p role="status">
                {state.status === "loading"
                  ? "Đang tải nội dung giới thiệu…"
                  : "Nội dung giới thiệu đang được cập nhật."}
              </p>
            )}
            {state.status !== "loading" && (
              <button
                type="button"
                onClick={retry}
                className="rounded-lg bg-[#710008] px-6 py-3 font-semibold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d49520]"
              >
                Thử lại
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
