/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import reels from "./reels";
import toast, { Toaster } from "react-hot-toast";
// import { InstagramEmbed } from "react-social-media-embed";
import dynamic from "next/dynamic";

const InstagramEmbed = dynamic(
  () =>
    import("react-social-media-embed").then(
      (mod) => mod.InstagramEmbed
    ),
  {
    ssr: false,
  }
);

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewer, setReviewer] = useState("");
  const [primaryLabel, setPrimaryLabel] = useState("");
  const [hateCategory, setHateCategory] = useState("");
  const [hateType, setHateType] = useState("");
  const [severity, setSeverity] = useState("");
  const [jumpIndex, setJumpIndex] = useState("");

  const [loading, setLoading] = useState(false);
  const currentReel = reels[currentIndex];
  useEffect(() => {
    const savedReviewer = localStorage.getItem("reviewer");
    if (savedReviewer) {
      setReviewer(savedReviewer);
    }
  }, []);
  useEffect(() => {
    if (reviewer) {
      localStorage.setItem("reviewer", reviewer);
    }
  }, [reviewer]);
  const resetForm = () => {
    setPrimaryLabel("");
    setHateCategory("");
    setHateType("");
    setSeverity("");
  };
  const moveNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, reels.length - 1)
    );
  };
  const saveAnnotation = async () => {
    if (!reviewer.trim()) {
      toast.error("Please enter reviewer name");
      return;
    }
    if (!primaryLabel) {
      toast.error("Please select primary label");
      return;
    }
    if (
      primaryLabel === "Hate" &&
      (!hateCategory || !hateType || !severity)
    ) {
      toast.error("Please fill all hate fields");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        reviewer: reviewer.toLowerCase().replace(/\s+/g, ""),
        reelId: currentReel.id,
        reelUrl: currentReel.url,
        primaryLabel,
        hateCategory,
        hateType,
        severity,
      };
      await fetch("https://script.google.com/macros/s/AKfycbxM_2msl7bHFgKC8crVIYe9ouwsuK9bR4h9JuctSWgTgLtOiTVb6bgd68MSyXzglL9aNA/exec", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Annotation Saved");
      resetForm();
      setTimeout(() => {
        moveNext();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save annotation");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#0B1020] text-white flex items-center
justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-[#121A2D] border border-[#24304A]
rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reel Annotation</h1>
            <p className="text-sm text-slate-400 mt-1">
              Collaborative Review Platform
            </p>
          </div>
          <div className="bg-[#1E293B] px-4 py-2 rounded-2xl text-sm border
border-[#334155]">
            {currentIndex + 1} / {reels.length}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Go to reel #"
            value={jumpIndex}
            onChange={(e) => setJumpIndex(e.target.value)}
            className="flex-1 bg-[#1E293B] border border-[#334155] rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]"
          />

          <button
            onClick={() => {
              const index = Number(jumpIndex) - 1;

              if (index >= 0 && index < reels.length) {
                resetForm();
                setCurrentIndex(index);
                setJumpIndex("");
              } else {
                alert("Invalid reel number");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const index = Number(jumpIndex) - 1;

                if (index >= 0 && index < reels.length) {
                  resetForm();
                  setCurrentIndex(index);
                  setJumpIndex("");
                } else {
                  alert("Invalid reel number");
                }
              }
            }}
            className="bg-[#5B8CFF] hover:bg-[#4A7AF0] px-4 rounded-2xl font-semibold"
          >
            Go
          </button>
        </div>
        <br />
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Reviewer Name"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#334155]
rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]
transition-all"
          />
          {/* <a
            href={currentReel.url}
            target="_blank"
            className="w-full block text-center bg-[#5B8CFF] hover:bg-
[#4A7AF0] transition-all rounded-2xl py-4 font-semibold"
          >
            Watch Instagram Reel
          </a> */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl overflow-hidden">
            <div className="h-[450px] md:h-[520px] overflow-y-auto flex justify-center">
              <InstagramEmbed
                key={currentReel.id}
                url={currentReel.url}
                width={"100%"}
                captioned={false}
              />
            </div>
          </div>
          <select
            value={primaryLabel}
            onChange={(e) => setPrimaryLabel(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#334155]
rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]
transition-all"
          >
            <option value="">Select Primary Label</option>
            <option value="Neutral">Neutral</option>
            <option value="Offensive">Offensive</option>
            <option value="Hate">Hate</option>
          </select>
          {primaryLabel === "Hate" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <select
                value={hateCategory}
                onChange={(e) => setHateCategory(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#334155]
rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]
transition-all"
              >
                <option value="">Select Hate Category</option>
                <option value="Religion">Religion</option>
                <option value="Caste">Caste</option>
                <option value="Gender">Gender</option>
                <option value="Political">Political</option>
              </select>
              <select
                value={hateType}
                onChange={(e) => setHateType(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#334155]
rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]
transition-all"
              >
                <option value="">Select Hate Type</option>
                <option value="Slur">Slur</option>
                <option value="Threat">Threat</option>
                <option value="Stereotype">Stereotype</option>
                <option value="Sarcasm/Meme">Sarcasm/Meme</option>
                <option value="Abusive">Abusive</option>
              </select>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#334155]
rounded-2xl px-4 py-3 text-white outline-none focus:border-[#5B8CFF]
transition-all"
              >
                <option value="">Select Severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          )}
          <button
            onClick={saveAnnotation}
            disabled={loading}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A]
disabled:opacity-50 transition-all rounded-2xl py-4 font-semibold"
          >
            {loading ? "Saving..." : "Save Annotation"}
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => {
                resetForm();

                setCurrentIndex((prev) =>
                  Math.max(prev - 1, 0)
                );
              }}
              className="flex-1 bg-[#1E293B] hover:bg-[#273449] transition-all rounded-2xl py-3 border border-[#334155]"
            >
              Previous
            </button>
            <button
              onClick={() => {
                resetForm();

                setCurrentIndex((prev) =>
                  Math.min(prev + 1, reels.length - 1)
                );
              }}
              className="flex-1 bg-[#1E293B] hover:bg-[#273449] transition-all rounded-2xl py-3 border border-[#334155]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

