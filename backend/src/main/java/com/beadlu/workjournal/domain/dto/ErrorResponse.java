package com.beadlu.workjournal.domain.dto;

public record ErrorResponse(
        int status,
        String message,
        String details
) {
}
