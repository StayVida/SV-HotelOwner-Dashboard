import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, FileText, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

const Scanner = () => {
  const [scannedReceipts, setScannedReceipts] = useState<Array<{
    id: string;
    name: string;
    date: string;
    status: string;
  }>>([]);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image or PDF file");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Add to scanned receipts
    const newReceipt = {
      id: `REC${Date.now()}`,
      name: file.name,
      date: new Date().toLocaleDateString(),
      status: "processed"
    };

    setScannedReceipts([newReceipt, ...scannedReceipts]);
    toast.success("Receipt uploaded and processed successfully!");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          const newReceipt = {
            id: decodedText,
            name: `QR Scan - ${decodedText.substring(0, 20)}`,
            date: new Date().toLocaleDateString(),
            status: "processed"
          };
          setScannedReceipts([newReceipt, ...scannedReceipts]);
          toast.success("QR Code scanned successfully!");
          stopScanning();
        },
        undefined
      );
    } catch (err) {
      toast.error("Failed to start camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Receipt Scanner</h2>
            <p className="text-muted-foreground text-lg font-medium">Scan and manage booking receipts</p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="p-4 sm:p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-accent mx-auto flex items-center justify-center">
              <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">Scan Receipt</h3>
              <p className="text-sm sm:text-base text-muted-foreground font-medium px-4">
                Scan QR codes or upload receipt files
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
              onChange={handleFileUpload}
              aria-label="Upload receipt file"
              className="hidden"
            />

            {/* QR Scanner */}
            {isScanning && (
              <div className="relative mx-auto max-w-md">
                <div 
                  id="qr-reader" 
                  ref={qrReaderRef}
                  className="rounded-2xl overflow-hidden border-2 border-primary/20"
                ></div>
                <Button
                  onClick={stopScanning}
                  variant="destructive"
                  className="mt-4 w-full sm:w-auto"
                >
                  <X className="w-4 h-4 mr-2" />
                  Stop Scanning
                </Button>
              </div>
            )}

            {!isScanning && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4">
                <Button
                  onClick={startScanning}
                  className="gradient-primary hover:shadow-glow transition-all duration-300 font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base flex-1"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Scan QR Code
                </Button>
                <Button
                  onClick={triggerFileUpload}
                  variant="outline"
                  className="font-semibold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base flex-1"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Upload File
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium px-4">
                Scan QR codes with camera or upload JPG, PNG, WEBP, PDF (Max 10MB)
              </p>
            </div>
          </div>
        </Card>

        {/* Scanned Receipts */}
        {scannedReceipts.length > 0 && (
          <Card className="p-4 sm:p-8 shadow-lg border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 tracking-tight">Scanned Receipts</h3>
              <p className="text-sm text-muted-foreground font-medium">
                {scannedReceipts.length} receipt{scannedReceipts.length > 1 ? 's' : ''} processed
              </p>
            </div>

            <div className="space-y-3">
              {scannedReceipts.map((receipt, index) => (
                <div
                  key={receipt.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all duration-300 border border-border/50 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 gap-3 sm:gap-0"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300 shrink-0">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground tracking-tight mb-1 truncate text-sm sm:text-base">{receipt.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                        Scanned on {receipt.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl gradient-primary">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                      <span className="text-xs sm:text-sm font-semibold text-primary-foreground">
                        {receipt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
  );
};

export default Scanner;
