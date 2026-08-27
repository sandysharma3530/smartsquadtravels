"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SafeCmsImage } from "@/components/shared/SafeCmsImage";
import { cn } from "@/lib/utils";
import {
  DEFAULT_BRAND_LOGO,
  resolveBrandLogo,
} from "@/lib/cms/brand-logo";
import type { CmsBrandLogo } from "@/lib/cms/types";

type LogoUploadFieldProps = {
  value?: CmsBrandLogo | null;
  onUploaded: (logo: CmsBrandLogo) => void;
  onReset: () => void;
};

export function LogoUploadField({
  value,
  onUploaded,
  onReset,
}: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const logo = resolveBrandLogo({ logo: value });
  const usingDefault = logo.header === DEFAULT_BRAND_LOGO.header;

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setInfo("Creating header, tab, and app icons…");

    const form = new FormData();
    form.set("folder", "brand");
    form.set("variant", "logo");
    form.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Logo upload failed.");
        return;
      }
      const uploaded = (data.files?.[0]?.logo || data.logo) as CmsBrandLogo | undefined;
      if (!uploaded?.header) {
        setError("Upload completed but logo variants were not returned.");
        return;
      }
      onUploaded(uploaded);
      setInfo(
        `Logo fitted automatically${
          uploaded.headerWidth && uploaded.headerHeight
            ? ` · header ${uploaded.headerWidth}×${uploaded.headerHeight}`
            : ""
        }. Save draft, then Publish live.`,
      );
    } catch {
      setError("Logo upload failed. Try a PNG or JPG under 12MB.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted">
        Upload one PNG or JPG. Extra padding is trimmed, then the image is fitted
        for the header, browser tab, Apple icon, and app icons. Transparent PNGs
        sit on the navy header automatically.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Header / footer
          </p>
          <div className="flex h-28 items-center rounded-xl bg-navy px-4">
            <div className="relative h-20 w-full max-w-[14rem]">
              <SafeCmsImage
                src={logo.header}
                alt="Header logo preview"
                fill
                className="object-contain object-left"
                sizes="224px"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Auto-fitted sizes
          </p>
          <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-bg-light p-3">
            <PreviewTile src={logo.favicon} label="Tab 32" size={32} />
            <PreviewTile src={logo.apple} label="Apple 180" size={56} rounded />
            <PreviewTile src={logo.icon192} label="App 192" size={64} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload logo"}
        </button>
        {!usingDefault ? (
          <button
            type="button"
            disabled={uploading}
            className="text-sm font-semibold text-red-600"
            onClick={() => {
              onReset();
              setInfo("Restored the default website logo. Publish live to apply.");
              setError("");
            }}
          >
            Use default logo
          </button>
        ) : (
          <span className="text-xs font-medium text-teal">Using the current website logo</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(event) => handleFile(event.target.files)}
      />

      {info ? <p className="text-xs font-medium text-teal">{info}</p> : null}
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function PreviewTile({
  src,
  label,
  size,
  rounded,
}: {
  src: string;
  label: string;
  size: number;
  rounded?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative overflow-hidden border border-slate-200 bg-navy",
          rounded ? "rounded-2xl" : "rounded-md",
        )}
        style={{ width: size, height: size }}
      >
        <SafeCmsImage src={src} alt="" fill className="object-contain" sizes={`${size}px`} />
      </div>
      <span className="text-[10px] font-medium text-text-muted">{label}</span>
    </div>
  );
}
