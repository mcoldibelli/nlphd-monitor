package com.nlphd.monitor.sales.infrastructure;

import java.awt.print.Pageable;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpringDataSalesOrderRepository extends JpaRepository<SalesOrderJpaEntity, UUID> {
  @Query("select s from SalesOrderJpaEntity s order by s.createdAt desc")
  List<SalesOrderJpaEntity> findRecent(Pageable pageable);
}
