package com.nlphd.monitor.fiscal.domain;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FiscalDoc {
  UUID id;
  UUID orderId;
  DocType docType;
  DocStatus status;
  String protocol;
  String rejectionReason;
  OffsetDateTime updatedAt;
}
