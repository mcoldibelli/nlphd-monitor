package com.nlphd.monitor.sales.infrastructure;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpringDataSalesOrderRepository extends JpaRepository<SalesOrderJpaEntity, UUID> {

  @Query("select s from SalesOrderJpaEntity s order by s.createdAt desc")
  List<SalesOrderJpaEntity> findRecent(Pageable pageable);

  long countByCreatedAtBetween(OffsetDateTime start, OffsetDateTime end);

  @Query("select coalesce(sum(s.totalAmount), 0) from SalesOrderJpaEntity s where s.createdAt between :start and :end")
  BigDecimal sumTotalBetween(OffsetDateTime start, OffsetDateTime end);
}
