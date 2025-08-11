package com.nlphd.monitor.fiscal.infrastructure;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.FiscalDoc;
import com.nlphd.monitor.fiscal.domain.FiscalDocRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class FiscalDocRepositoryImpl implements FiscalDocRepository {

  private final SpringDataFiscalDocRepository jpa;

  private static FiscalDoc toDomain(FiscalDocJpaEntity e) {
    return FiscalDoc.builder().id(e.getId()).orderId(e.getOrderId()).docType(e.getDocType())
        .status(e.getStatus()).protocol(e.getProtocol()).rejectionReason(e.getRejectionReason())
        .updatedAt(e.getUpdatedAt()).build();
  }

  @Override
  public List<FiscalDoc> findRecentAll(int page, int size) {
    return jpa.findAllByOrderByUpdatedAtDesc(PageRequest.of(page, size))
        .map(FiscalDocRepositoryImpl::toDomain).toList();
  }

  @Override
  public List<FiscalDoc> findRecentByStatus(DocStatus status, int page, int size) {
    return jpa.findByStatusOrderByUpdatedAtDesc(status, PageRequest.of(page, size))
        .map(FiscalDocRepositoryImpl::toDomain).toList();
  }

  @Override
  public long countAll() {
    return jpa.count();
  }

  @Override
  public long countByStatus(DocStatus status) {
    return jpa.countByStatus(status);
  }
}
