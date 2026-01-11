package com.beadlu.workjournal.mappers;

import com.beadlu.workjournal.domain.dto.TaskDto;
import com.beadlu.workjournal.domain.entities.Task;

public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}
