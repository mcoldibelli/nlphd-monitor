package com.nlphd.monitor.fiscal.infrastructure;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.DocType;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.simulation.enabled", havingValue = "true", matchIfMissing = true)
public class FiscalStatusSimulator {

  private final SpringDataFiscalDocRepository repository;
  private final Random rnd = new Random();

  @Scheduled(fixedDelayString = "${app.simulation.delay-ms:15000}", initialDelayString = "${app.simulation.initial-delay-ms:3000}")
  public void tick() {

    // 1) Se não há docs, cria alguns com status PROCESSANDO
    if (repository.count() == 0) {
      for (int i = 0; i < 10; i++) {
        var e = new FiscalDocJpaEntity();
        e.setOrderId(UUID.randomUUID());
        e.setDocType(rnd.nextBoolean() ? DocType.NFCE : DocType.NFE);
        e.setStatus(DocStatus.PROCESSANDO);
        repository.save(e);
      }
    }

    // 2) Promove até 5 PROCESSANDO
    var page = repository.findByStatusOrderByUpdatedAtDesc(DocStatus.PROCESSANDO,
        PageRequest.of(0, 5));

    page.getContent().forEach(e-> {
      if(rnd.nextDouble() < 0.85) {
        // Authoriza
        e.setStatus(DocStatus.AUTORIZADO);
        e.setProtocol("PRT-" + (100000) + rnd.nextInt(900000));
        e.setRejectionReason(null);
      } else {
        // Rejeita
        e.setStatus(DocStatus.REJEITADO);
        e.setProtocol(null);
        var reasons = List.of("CFOP inválido", "CNPJ inválido", "Valor total divergente", "Chave inválida");
        e.setRejectionReason(reasons.get(rnd.nextInt(reasons.size())));
      }
      repository.save(e);
    });

    // 3) Mantém a fila viva: cria alguns PROCESSANDO às vezes
    if(rnd.nextDouble() < 0.5) {
      for(int i = 0; i < rnd.nextInt(3)+1; i++) {
        var e = new FiscalDocJpaEntity();
        e.setOrderId(UUID.randomUUID());
        e.setDocType(rnd.nextBoolean() ? DocType.NFCE : DocType.NFE);
        e.setStatus(DocStatus.PROCESSANDO);
        repository.save(e);
      }
    }
  }
}
