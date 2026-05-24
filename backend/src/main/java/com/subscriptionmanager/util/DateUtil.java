package com.subscriptionmanager.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

    private DateUtil() {}

    public static String formatDate(LocalDate date) {
        return date != null ? date.format(DATE_FMT) : null;
    }

    public static LocalDate startOfMonth(LocalDate ref) {
        return ref.withDayOfMonth(1);
    }

    public static LocalDate endOfMonth(LocalDate ref) {
        return ref.withDayOfMonth(ref.lengthOfMonth());
    }

    public static LocalDateTime now() {
        return LocalDateTime.now();
    }
}
