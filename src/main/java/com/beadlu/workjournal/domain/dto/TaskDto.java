package com.beadlu.workjournal.domain.dto;

import com.beadlu.workjournal.domain.entities.TaskPriority;
import com.beadlu.workjournal.domain.entities.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
) {
}
