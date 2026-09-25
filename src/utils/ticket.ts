import jsPDF from "jspdf";
import { formatCurrency, formatQuantity } from "@/utils/format";
import { calculateItemSubtotal } from "@/utils/pricing";
import type { Order, OrderItemWithDetails } from "@/types/order";
import logoUrl from "@/assets/logo.png";

function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo procesar el logo"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => reject(new Error("No se pudo cargar el logo"));
    img.src = url;
  });
}

export async function generateOrderTicket(
  order: Order,
  items: OrderItemWithDetails[]
) {
  const doc = new jsPDF({ unit: "mm", format: [80, 170 + items.length * 10] });
  const marginX = 5;
  const pageWidth = 80;
  let y = 8;

  try {
    const logo = await loadImageAsDataUrl(logoUrl);
    const logoWidthMM = 20;
    const logoHeightMM = (logo.height / logo.width) * logoWidthMM;
    const logoX = (pageWidth - logoWidthMM) / 2;
    doc.addImage(logo.dataUrl, "PNG", logoX, y, logoWidthMM, logoHeightMM);
    y += logoHeightMM + 4;
  } catch {
    // Sin logo, el ticket se genera igual con el texto solamente.
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JPB - Frutos Secos y Más", pageWidth / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${order.customer_name || "Sin nombre"}`, marginX, y);
  y += 5;

  const date = order.completed_at ? new Date(order.completed_at) : new Date();
  doc.text(`Fecha: ${date.toLocaleString("es-AR")}`, marginX, y);
  y += 7;

  doc.line(marginX, y, 75, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Producto", marginX, y);
  doc.text("Total", 65, y, { align: "right" });
  y += 5;
  doc.setFont("helvetica", "normal");

  let total = 0;

  for (const item of items) {
    const productName = item.product?.name ?? "Producto";
    const qtyLabel = formatQuantity(item.quantity, item.unit?.abbreviation ?? "");

    doc.text(productName, marginX, y);
    y += 4;

    const lineTotal = calculateItemSubtotal(item);
    total += lineTotal;

    doc.text(qtyLabel, marginX, y);
    doc.text(formatCurrency(lineTotal), 75, y, { align: "right" });
    y += 4;

    if (item.discount_percent > 0) {
      doc.setFontSize(7.5);
      doc.text(`Descuento aplicado: -${item.discount_percent}%`, marginX, y);
      doc.setFontSize(9);
      y += 4;
    }

    y += 2;
  }

  doc.line(marginX, y, 75, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL", marginX, y);
  doc.text(formatCurrency(order.total ?? total), 75, y, { align: "right" });

  doc.save(`pedido-${order.customer_name || "sin-nombre"}-${date.toISOString().slice(0, 10)}.pdf`);
}