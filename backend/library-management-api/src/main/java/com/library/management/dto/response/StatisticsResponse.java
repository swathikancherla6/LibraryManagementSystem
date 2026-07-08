package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StatisticsResponse {
    private List<ChartDataPoint> booksByCategory;
    private List<ChartDataPoint> monthlyBorrowTrends;
    private List<ChartDataPoint> memberGrowth;
    private List<ChartDataPoint> borrowVsReturn;
}
