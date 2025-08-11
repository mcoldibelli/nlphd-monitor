package com.nlphd.monitor.fiscal.infrastructure;


import com.nlphd.monitor.fiscal.domain.DocStatus;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataFiscalDocRepository extends JpaRepository<FiscalDocJpaEntity, UUID> {
  Page<FiscalDocJpaEntity> findAllByOrderByUpdatedAtDesc(Pageable pageable);
  Page<FiscalDocJpaEntity> findByStatusOrderByUpdatedAtDesc(DocStatus status, Pageable pageable);
  long countByStatus(DocStatus status);

}
