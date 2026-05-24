package com.subscriptionmanager.service;

import org.springframework.core.io.Resource;

public interface ReportService {
    Resource exportPdf(String reportType);
    Resource exportExcel(String reportType);
}
