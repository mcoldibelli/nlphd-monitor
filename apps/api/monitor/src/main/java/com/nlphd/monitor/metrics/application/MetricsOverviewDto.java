package com.nlphd.monitor.metrics.application;

import java.math.BigDecimal;

public record MetricsOverviewDto(
    String date,
    Sales sale,
    Fiscal fiscal
) {
  public record Sales(long count, BigDecimal total) {}
  public record Fiscal (long processando, long autorizado, long rejeitado) {}
}
