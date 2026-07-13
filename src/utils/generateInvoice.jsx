import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {
  const doc = new jsPDF();

  // ===========================
  // HEADER
  // ===========================
 
doc.setFillColor(33, 150, 243);
doc.rect(0, 0, 210, 30, "F");

doc.setTextColor(255, 255, 255);
doc.setFontSize(22);
doc.text("BANGLES SHOP", 105, 15, {
  align: "center",
});

doc.setFontSize(11);
doc.text("Premium Fashion Jewellery", 105, 23, {
  align: "center",
});

doc.setTextColor(0, 0, 0);
  // ===========================
  // INVOICE DETAILS
  // ===========================
  const invoiceNo =
    "INV-" +
    new Date().getFullYear() +
    "-" +
    order.id.slice(0, 6).toUpperCase();

  const orderDate = order.createdAt
    ? new Date(
        order.createdAt.seconds * 1000
      ).toLocaleDateString("en-IN")
    : "-";

  doc.setFontSize(11);

  doc.text(`Invoice No : ${invoiceNo}`, 15, 42);
  doc.text(`Order ID : ${order.id}`, 15, 50);
  doc.text(`Order Date : ${orderDate}`, 15, 58);

  doc.text(
    `Payment : ${order.paymentStatus || "-"}`,
    120,
    42
  );

  doc.text(
    `Status : ${order.orderStatus}`,
    120,
    50
  );
doc.setDrawColor(200);

doc.roundedRect(12, 38, 88, 42, 2, 2);

doc.roundedRect(110, 38, 88, 42, 2, 2);

doc.setFontSize(12);
doc.text("Invoice Details", 16, 46);

doc.setFontSize(10);

doc.text(`Invoice : ${invoiceNo}`, 16, 54);
doc.text(`Order : ${order.id}`, 16, 61);
doc.text(`Date : ${orderDate}`, 16, 68);

doc.setFontSize(12);
doc.text("Customer", 114, 46);

doc.setFontSize(10);

doc.text(order.customerName || "-", 114, 54);
doc.text(order.mobile || "-", 114, 61);
doc.text(order.address || "-", 114, 68);
doc.text(
  `${order.city || ""}, ${order.state || ""}`,
  114,
  75
);
  // ===========================
  // CUSTOMER
  // ===========================
 
  // ===========================
  // PRODUCTS TABLE
  // ===========================
  autoTable(doc, {
    startY: 90,

    head: [
      [
        "Product",
        "Size",
        "Color",
        "Qty",
        "Price",
        "Total",
      ],
    ],

    body: order.products.map((item) => {
      const price = Number(
        item.discountPrice || item.price
      );

      return [
        item.productName,
        item.selectedSize || "-",
        item.selectedColor?.name || "-",
        item.qty,
        `₹${price}`,
        `₹${price * item.qty}`,
      ];
    }),

    theme: "striped",

styles: {
  fontSize: 10,
},

headStyles: {
  fillColor: [25, 118, 210],
  textColor: 255,
  halign: "center",
},

bodyStyles: {
  halign: "center",
},

alternateRowStyles: {
  fillColor: [248, 248, 248],
},
  });
const subtotal = order.products.reduce(
  (sum, item) =>
    sum +
    Number(item.discountPrice || item.price) *
      Number(item.qty || 1),
  0
);

const deliveryCharge = 0;

const grandTotal = subtotal + deliveryCharge;
  // ===========================
  // TOTALS
  // ===========================
 // ===========================
// TOTALS
// ===========================

const y = doc.lastAutoTable.finalY + 10;

doc.setDrawColor(180);
doc.roundedRect(120, y, 75, 42, 2, 2);

doc.setFontSize(11);
doc.setTextColor(0);

doc.text("Subtotal", 125, y + 10);
doc.text(`₹${subtotal}`, 185, y + 10, {
  align: "right",
});

doc.text("Delivery", 125, y + 20);
doc.text(
  deliveryCharge === 0
    ? "FREE"
    : `₹${deliveryCharge}`,
  185,
  y + 20,
  {
    align: "right",
  }
);

doc.setDrawColor(220);
doc.line(123, y + 25, 190, y + 25);

doc.setFontSize(13);
doc.setTextColor(0, 128, 0);

doc.text("Grand Total", 125, y + 36);

doc.text(`₹${grandTotal}`, 185, y + 36, {
  align: "right",
});

doc.setTextColor(0);

  // ===========================
  // FOOTER
  // ===========================
 const footerY = y + 55;

doc.setDrawColor(180);

doc.line(15, footerY, 195, footerY);

doc.setFontSize(11);
doc.setTextColor(25, 118, 210);

doc.text(
  "Thank You For Shopping With BANGLES SHOP ❤️",
  105,
  footerY + 10,
  {
    align: "center",
  }
);

doc.setFontSize(9);
doc.setTextColor(120);

doc.text(
  "Premium Fashion Jewellery",
  105,
  footerY + 18,
  {
    align: "center",
  }
);

doc.text(
  "This is a computer generated invoice. No signature required.",
  105,
  footerY + 25,
  {
    align: "center",
  }
);

  // ===========================
  // SAVE
  // ===========================
 doc.save(
  `BanglesShop_Invoice_${order.id.slice(0, 8)}.pdf`
);
};

export default generateInvoice;