package com.beadlu.workjournal.mappers;

import com.beadlu.workjournal.domain.dto.TaskListDto;
import com.beadlu.workjournal.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);

}
