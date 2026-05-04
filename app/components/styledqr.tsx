"use client";

import { useEffect, useMemo, useRef } from "react";
import QRCodeStyling, { type TypeNumber } from "qr-code-styling";
import qrcode from "qrcode-generator";

const DEFAULT_LOGO_IMAGE_SRC = "/default-logo.png";
const DEFAULT_LOGO_SCALE = 1.3;
const QR_ERROR_CORRECTION_LEVEL = "H";
const MIN_PROFILE_QR_TYPE_NUMBER = 7;

function toTypeNumber(value: number): TypeNumber {
  return Math.min(40, Math.max(1, Math.ceil(value))) as TypeNumber;
}

function getNormalizedTypeNumber(data: string): TypeNumber {
  const qr = qrcode(0, QR_ERROR_CORRECTION_LEVEL);
  qr.addData(data);
  qr.make();

  const autoTypeNumber = (qr.getModuleCount() - 17) / 4;
  return toTypeNumber(Math.max(MIN_PROFILE_QR_TYPE_NUMBER, autoTypeNumber));
}

export function StyledQR({
  url,
  size = 173,
  imageUrl,
  contentScale = 1,
  logoSizeRatio = 0.35,
}: {
  url: string;
  size?: number;
  imageUrl?: string | null;
  contentScale?: number;
  logoSizeRatio?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const normalizedTypeNumber = useMemo(
    () => (url ? getNormalizedTypeNumber(url) : MIN_PROFILE_QR_TYPE_NUMBER),
    [url]
  );

  useEffect(() => {
    const container = ref.current;
    if (!container || !url) return;

    container.innerHTML = "";

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: url,
      margin: 10,
      qrOptions: {
        typeNumber: normalizedTypeNumber,
        errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
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

    qrCode.append(container);

    return () => {
      container.innerHTML = "";
    };
  }, [normalizedTypeNumber, size, url]);

  const logoMaskSize = Math.round(size * logoSizeRatio);
  const overlayImageUrl = imageUrl?.trim() || DEFAULT_LOGO_IMAGE_SRC;
  const isUsingDefaultLogo = !imageUrl?.trim();

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
                src={overlayImageUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{
                  transform: isUsingDefaultLogo
                    ? `scale(${DEFAULT_LOGO_SCALE})`
                    : undefined,
                  transformOrigin: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
