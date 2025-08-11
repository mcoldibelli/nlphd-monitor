package com.nlphd.monitor.fiscal.application;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.DocType;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record FiscalDocDto(UUID id, UUID orderId, DocType docType, DocStatus status,
                           String protocol, String rejectionReason, OffsetDateTime updatedAt) {

}
