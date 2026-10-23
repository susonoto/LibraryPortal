import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, X, Keyboard } from 'lucide-react';

/**
 * Reusable QR / Barcode scanner.
 * Supports camera scan + manual keyboard entry (USB barcode scanners act as keyboards).
 */
export default function BarcodeScanner({
  onScan,
  onClose,
  title = 'Scan Code',
  hint = 'Point camera at QR / Barcode, or type / use USB scanner',
  continuous = false,
}) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [error, setError] = useState(null);
  const [manual, setManual] = useState('');
  const [mode, setMode] = useState('camera'); // camera | manual
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (mode !== 'camera') return;

    let cancelled = false;
    const start = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        html5QrRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          setError('No camera found. Use manual entry or a USB barcode scanner.');
          setMode('manual');
          return;
        }

        // Prefer back camera
        const cameraId =
          cameras.find((c) => /back|rear|environment/i.test(c.label))?.id ||
          cameras[cameras.length - 1].id;

        await scanner.start(
          cameraId,
          {
            fps: 12,
            qrbox: { width: 260, height: 160 },
            aspectRatio: 1.777,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.ITF,
            ],
          },
          (decodedText) => {
            if (cancelled) return;
            handleResult(decodedText);
          },
          () => {}
        );
        if (!cancelled) setScanning(true);
      } catch (err) {
        console.error(err);
        setError(err?.message || 'Could not start camera. Switch to manual entry.');
        setMode('manual');
      }
    };

    start();

    return () => {
      cancelled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Focus manual input when in manual mode (USB scanners type + Enter)
  useEffect(() => {
    if (mode === 'manual' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const stopScanner = async () => {
    try {
      if (html5QrRef.current?.isScanning) {
        await html5QrRef.current.stop();
      }
      html5QrRef.current?.clear();
    } catch (_) {}
    setScanning(false);
  };

  const handleResult = async (text) => {
    const value = String(text).trim();
    if (!value) return;

    if (!continuous) {
      await stopScanner();
    }
    onScan(value);
    if (!continuous && onClose) onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manual.trim()) handleResult(manual.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="neo-card w-full max-w-md rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 dark:border-white/5">
          <div>
            <h3 className="font-semibold text-base">{title}</h3>
            <p className="text-xs opacity-50 mt-0.5">{hint}</p>
          </div>
          <button
            onClick={async () => {
              await stopScanner();
              onClose?.();
            }}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode switch */}
        <div className="flex gap-2 px-5 pt-4">
          <button
            onClick={() => setMode('camera')}
            className={`neo-btn flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-2 ${
              mode === 'camera' ? 'text-neo-accent font-medium' : 'opacity-60'
            }`}
          >
            <Camera className="w-4 h-4" /> Camera
          </button>
          <button
            onClick={async () => {
              await stopScanner();
              setMode('manual');
            }}
            className={`neo-btn flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-2 ${
              mode === 'manual' ? 'text-neo-accent font-medium' : 'opacity-60'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Manual / USB
          </button>
        </div>

        <div className="p-5">
          {mode === 'camera' ? (
            <div>
              <div
                id="qr-reader"
                ref={scannerRef}
                className="rounded-xl overflow-hidden bg-black/10 dark:bg-black/30 min-h-[220px]"
              />
              {error && (
                <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
              )}
              {scanning && (
                <p className="text-xs opacity-50 mt-3 text-center animate-pulse">
                  Scanning… hold steady
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <p className="text-xs opacity-60">
                Type the code, or use a USB barcode scanner (it types automatically and presses Enter).
              </p>
              <input
                ref={inputRef}
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Scan or type barcode / QR data"
                className="neo-input w-full text-center text-lg tracking-wider"
                autoComplete="off"
                autoFocus
              />
              <button
                type="submit"
                className="neo-btn w-full py-2.5 rounded-xl text-sm font-medium text-neo-accent"
              >
                Confirm Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
