package com.nlphd.monitor.sales.application;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record SalesOrderDto(

    UUID id,
    String orderNumber,
    BigDecimal totalAmount,
    OffsetDateTime createdAt
) { }
