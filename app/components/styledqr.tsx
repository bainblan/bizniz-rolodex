"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export function StyledQR({
  url,
  size = 173,
  imageUrl,
  contentScale = 1,
}: {
  url: string;
  size?: number;
  imageUrl?: string | null;
  contentScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !url) return;

    ref.current.innerHTML = "";

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: url,
      margin: 0,
      qrOptions: {
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        hideBackgroundDots: false,
        imageSize: 0,
        margin: 0,
      },
      dotsOptions: {
        type: "rounded",
        color: "#111827",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#111827",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#111827",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    qrCode.append(ref.current);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [size, url]);

  const logoMaskSize = Math.round(size * 0.4);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-white"
      style={{ width: size, height: size }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          transform: `scale(${contentScale})`,
          transformOrigin: "center",
        }}
      >
        <div
          ref={ref}
          className="flex items-center justify-center bg-white"
          style={{ width: size, height: size }}
        />
        {imageUrl && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="flex items-center justify-center rounded-full bg-white p-[2px]"
              style={{ width: logoMaskSize, height: logoMaskSize }}
            >
              <div className="h-full w-full overflow-hidden rounded-full bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
