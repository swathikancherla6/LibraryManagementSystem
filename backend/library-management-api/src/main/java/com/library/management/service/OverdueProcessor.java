package com.library.management.service;

/**
 * Marks overdue borrows and creates/updates fines.
 * Invoked by the scheduler and read endpoints that need fresh status.
 */
public interface OverdueProcessor {
    void processOverdueRecords();
}
