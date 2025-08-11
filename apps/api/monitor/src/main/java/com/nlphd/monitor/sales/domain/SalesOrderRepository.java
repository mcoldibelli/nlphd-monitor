package com.nlphd.monitor.sales.domain;

import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesOrderRepository {
  List<SalesOrder> findRecent(int limit);
}
