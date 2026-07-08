package com.library.management.config;

import com.library.management.service.OverdueProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueScheduler {

    private final OverdueProcessor overdueProcessor;

    // ponytail: hourly scan; upgrade path — external cron or message queue for multi-instance
    @Scheduled(cron = "0 0 * * * *")
    public void refreshOverdueStatuses() {
        overdueProcessor.processOverdueRecords();
        log.debug("Overdue scan completed");
    }
}
