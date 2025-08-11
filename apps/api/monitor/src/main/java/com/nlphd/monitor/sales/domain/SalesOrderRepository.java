package com.nlphd.monitor.sales.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesOrderRepository {
  List<SalesOrder> findRecent(int limit);

  long countBetween(OffsetDateTime start, OffsetDateTime end);
  BigDecimal sumBetween(OffsetDateTime start, OffsetDateTime end);
}
