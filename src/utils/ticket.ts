import jsPDF from "jspdf";
import { formatCurrency, formatQuantity } from "@/utils/format";
import type { Order, OrderItemWithDetails } from "@/types/order";

export function generateOrderTicket(order: Order, items: OrderItemWithDetails[]) {
  const doc = new jsPDF({ unit: "mm", format: [80, 150 + items.length * 8] });
  const marginX = 5;
  let y = 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("🥜 Control Stock", marginX, y);
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

    const price = item.product?.price ?? 0;
    const saleUnitFactor = item.product?.saleUnit?.conversion_factor ?? 1;
    const itemUnitFactor = item.unit?.conversion_factor ?? 1;
    const qtyInSaleUnit = (item.quantity * itemUnitFactor) / saleUnitFactor;
    const lineTotal = price * qtyInSaleUnit;
    total += lineTotal;

    doc.text(qtyLabel, marginX, y);
    doc.text(formatCurrency(lineTotal), 75, y, { align: "right" });
    y += 6;
  }

  doc.line(marginX, y, 75, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL", marginX, y);
  doc.text(formatCurrency(order.total ?? total), 75, y, { align: "right" });

  doc.save(`pedido-${order.customer_name || "sin-nombre"}-${date.toISOString().slice(0, 10)}.pdf`);
}