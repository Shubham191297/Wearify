const PDFDocument = require("pdfkit");
const Product = require("../models/product");
const fs = require("fs");

function pdfGenerator(res, invoicePath, orderId, order) {
  const pdfDoc = new PDFDocument();

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.font("Times-Roman");
  pdfDoc
    .fontSize(16)
    .text("Order Details", { align: "center", underline: true });
  pdfDoc.moveDown(3);

  pdfDoc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`Order ID: `, { align: "left", continued: true });
  pdfDoc.font("Times-Roman").text(`${orderId}`, { align: "left" });
  pdfDoc.moveDown();
  pdfDoc
    .fontSize(13)
    .font("Helvetica-Bold")
    .text(`Name: `, { align: "left", continued: true });
  pdfDoc.font("Times-Roman").text(`${order.user.name}`, { align: "left" });
  pdfDoc.moveDown();
  pdfDoc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(`Amount: `, { align: "left", continued: true });
  pdfDoc
    .font("Times-Roman")
    .text(`Rs. ${order.cost.toFixed(2)}`, { align: "left" });
  pdfDoc.moveDown(3);

  pdfDoc.fontSize(13).text("Items:", { underline: true });
  pdfDoc.moveDown();

  const headerY = pdfDoc.y;
  pdfDoc.fontSize(12);
  pdfDoc.font("Helvetica-Bold").text("Item Name", 50, headerY, {
    width: 100,
    align: "left",
  });
  pdfDoc.font("Helvetica-Bold").text("Price", 150, headerY, {
    width: 100,
    align: "right",
  });
  pdfDoc.moveDown();

  // Draw items
  pdfDoc.font("Times-Roman");
  const ordersData = order.products.map((item) =>
    Product.findById(item.id).then((product) => {
      const yPosition = pdfDoc.y;
      pdfDoc.text(`${product.title}  - `, 50, yPosition, {
        width: 100,
        align: "left",
      });
      pdfDoc.text(`Rs. ${product.price.toFixed(2)}`, 150, yPosition, {
        width: 100,
        align: "right",
      });
      pdfDoc.moveDown();
    })
  );

  // Draw total price
  Promise.all(ordersData)
    .then(() => {
      pdfDoc.moveDown();
      const yPos = pdfDoc.y;
      pdfDoc
        .fontSize(13)
        .text(`Total: `, 50, yPos, { width: 100, align: "left" });
      pdfDoc.fontSize(13).text(`Rs. ${order.cost.toFixed(2)}`, 150, yPos, {
        width: 100,
        align: "right",
      });

      pdfDoc.end();
    })
    .catch((err) => {
      throw new Error(err.message);
    });
}

module.exports = pdfGenerator;
