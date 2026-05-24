package com.subscriptionmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationStatusDTO {
    private String provider;
    private boolean configured;
    private boolean connected;
    private String message;
}
