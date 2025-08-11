package com.nlphd.monitor.fiscal.domain;

import java.util.List;

public interface FiscalDocRepository {
  List<FiscalDoc> findRecentAll(int page, int size);
  List<FiscalDoc> findRecentByStatus(DocStatus status, int page, int size);
  long countAll();
  long countByStatus(DocStatus status);
}
