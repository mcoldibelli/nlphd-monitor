package com.nlphd.monitor.sales.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SalesOrder {

  UUID id;
  String orderNumber;
  BigDecimal totalAmount;
  OffsetDateTime createdAt;
}
