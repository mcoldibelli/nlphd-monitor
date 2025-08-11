package com.nlphd.monitor.sales.application;

import com.nlphd.monitor.sales.domain.SalesOrderRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListRecentSalesOrdersUseCase {
  private final SalesOrderRepository repository;

  public List<SalesOrderDto> execute(int limit) {
    return repository.findRecent(Math.max(1, limit)).stream()
        .map(order -> SalesOrderDto.builder()
            .id(order.getId())
            .orderNumber(order.getOrderNumber())
            .totalAmount(order.getTotalAmount())
            .createdAt(order.getCreatedAt())
          .build())
        .toList();
  }
}
