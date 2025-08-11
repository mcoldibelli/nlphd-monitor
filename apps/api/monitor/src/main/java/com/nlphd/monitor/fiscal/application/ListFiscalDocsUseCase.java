package com.nlphd.monitor.fiscal.application;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.FiscalDoc;
import com.nlphd.monitor.fiscal.domain.FiscalDocRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ListFiscalDocsUseCase {

  private final FiscalDocRepository repository;

  public PagedResponse<FiscalDocDto> execute(String status, int page, int size) {
    final List<FiscalDoc> docs;
    final long total;

    if (status == null || status.equalsIgnoreCase("ALL")) {
      docs = repository.findRecentAll(page, size);
      total = repository.countAll();
    } else {
      var st = DocStatus.valueOf(status.toUpperCase());
      docs = repository.findRecentByStatus(st, page, size);
      total = repository.countByStatus(st);
    }

    var content = docs.stream().map(
            doc -> FiscalDocDto.builder().id(doc.getId()).orderId(doc.getOrderId())
                .docType(doc.getDocType()).status(doc.getStatus()).protocol(doc.getProtocol())
                .rejectionReason(doc.getRejectionReason()).updatedAt(doc.getUpdatedAt()).build())
        .toList();

    return new PagedResponse<>(content, page, size, total);
  }
}
