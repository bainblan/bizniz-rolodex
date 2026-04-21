"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export function StyledQR({ url, size = 153 }: { url: string; size?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !url) return;

        ref.current.innerHTML = "";

        const qrCode = new QRCodeStyling({
            width: size,
            height: size,
            type: "svg",
            data: url,
            qrOptions: {
                errorCorrectionLevel: "H",
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
            if (ref.current) ref.current.innerHTML = "";
        };
    }, [url, size]);

    return <div ref={ref} className="flex h-[153px] w-[153px] items-center justify-center bg-white" />;
}