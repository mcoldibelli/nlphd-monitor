package com.nlphd.monitor.fiscal.infrastructure;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.DocType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fiscal_docs")
@Getter
@Setter
public class FiscalDocJpaEntity {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false)
  private UUID orderId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private DocType docType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private DocStatus status;

  private String protocol;

  @Column(length = 500)
  private String rejectionReason;

  @Column(nullable = false)
  private OffsetDateTime updatedAt;

  @PrePersist @PreUpdate
  void stamp() {
    if(updatedAt == null) {
      updatedAt = OffsetDateTime.now();
    }
  }
}
