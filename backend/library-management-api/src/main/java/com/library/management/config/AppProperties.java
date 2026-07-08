package com.library.management.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private Borrow borrow = new Borrow();
    private Fine fine = new Fine();

    @Getter
    @Setter
    public static class Borrow {
        private int defaultLoanDays = 14;
        private int maxRenewals = 2;
        private int renewalDays = 7;
    }

    @Getter
    @Setter
    public static class Fine {
        private BigDecimal dailyRate = new BigDecimal("5.00");
    }
}
