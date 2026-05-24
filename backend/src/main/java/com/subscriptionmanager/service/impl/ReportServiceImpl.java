package com.subscriptionmanager.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.subscriptionmanager.repository.PaymentRepository;
import com.subscriptionmanager.repository.SubscriptionRepository;
import com.subscriptionmanager.repository.UserRepository;
import com.subscriptionmanager.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Resource exportPdf(String reportType) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            document.add(new Paragraph("Subscription Manager Report", titleFont));
            document.add(new Paragraph("Type: " + reportType));
            document.add(new Paragraph("Generated: " + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total Users: " + userRepository.count()));
            document.add(new Paragraph("Total Subscriptions: " + subscriptionRepository.count()));
            document.add(new Paragraph("Total Payments: " + paymentRepository.count()));

            document.close();
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    @Override
    public Resource exportExcel(String reportType) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(reportType != null ? reportType : "Report");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Metric");
            header.createCell(1).setCellValue("Value");

            Row r1 = sheet.createRow(1);
            r1.createCell(0).setCellValue("Users");
            r1.createCell(1).setCellValue(userRepository.count());

            Row r2 = sheet.createRow(2);
            r2.createCell(0).setCellValue("Subscriptions");
            r2.createCell(1).setCellValue(subscriptionRepository.count());

            Row r3 = sheet.createRow(3);
            r3.createCell(0).setCellValue("Payments");
            r3.createCell(1).setCellValue(paymentRepository.count());

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            workbook.write(out);
            return new ByteArrayResource(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }
    }
}
