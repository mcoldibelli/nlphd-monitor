package com.nlphd.monitor.metrics.application;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.FiscalDocRepository;
import com.nlphd.monitor.sales.domain.SalesOrderRepository;
import java.time.LocalDate;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetMetricsOverviewUseCase {

  private final SalesOrderRepository salesRepository;
  private final FiscalDocRepository fiscalRepository;

  public MetricsOverviewDto execute() {
    var today = LocalDate.now(ZoneOffset.UTC);
    var start = today.atStartOfDay().atOffset(ZoneOffset.UTC);
    var end = today.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

    var salesCount = salesRepository.countBetween(start, end);
    var salesTotal = salesRepository.sumBetween(start, end);

    var processing = fiscalRepository.countByStatus(DocStatus.PROCESSANDO);
    var authorized = fiscalRepository.countByStatus(DocStatus.AUTORIZADO);
    var rejected = fiscalRepository.countByStatus(DocStatus.REJEITADO);

    return new MetricsOverviewDto(today.toString(),
        new MetricsOverviewDto.Sales(salesCount, salesTotal),
        new MetricsOverviewDto.Fiscal(processing, authorized, rejected));
  }
}
