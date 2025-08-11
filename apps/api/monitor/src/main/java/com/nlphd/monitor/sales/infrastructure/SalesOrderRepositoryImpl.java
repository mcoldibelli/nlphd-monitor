package com.nlphd.monitor.sales.infrastructure;

import com.nlphd.monitor.sales.domain.SalesOrder;
import com.nlphd.monitor.sales.domain.SalesOrderRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SalesOrderRepositoryImpl implements SalesOrderRepository {
  private final SpringDataSalesOrderRepository jpa;

  @Override
  public List<SalesOrder> findRecent(int limit) {
    return jpa.findRecent(PageRequest.of(0, Math.max(1, limit)))
        .stream()
        .map(e -> SalesOrder.builder()
            .id(e.getId())
            .orderNumber(e.getOrderNumber())
            .totalAmount(e.getTotalAmount())
            .createdAt(e.getCreatedAt())
            .build())
        .toList();
  }

  @Override
  public long countBetween(OffsetDateTime start, OffsetDateTime end) {
    return jpa.countByCreatedAtBetween(start, end);
  }

  @Override
  public BigDecimal sumBetween(OffsetDateTime start, OffsetDateTime end) {
    return jpa.sumTotalBetween(start, end);
  }
}
