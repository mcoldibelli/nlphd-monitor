package com.nlphd.monitor.fiscal.infrastructure;

import com.nlphd.monitor.fiscal.domain.DocStatus;
import com.nlphd.monitor.fiscal.domain.DocType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;
import java.util.UUID;

@Configuration
public class FiscalDevSeed {

  @Bean
  CommandLineRunner seedFiscal(SpringDataFiscalDocRepository repo) {
    return args -> {
      if (repo.count() > 0) return;

      var rnd = new Random();
      for (int i = 0; i < 15; i++) {
        var e = new FiscalDocJpaEntity();
        e.setOrderId(UUID.randomUUID()); // em dev, só referência
        e.setDocType(rnd.nextBoolean() ? DocType.NFCE : DocType.NFE);
        var status = rnd.nextDouble() < 0.7 ? DocStatus.AUTORIZADO :
            (rnd.nextDouble() < 0.5 ? DocStatus.PROCESSANDO : DocStatus.REJEITADO);
        e.setStatus(status);
        if (status == DocStatus.AUTORIZADO) e.setProtocol("PRT-" + (100000 + rnd.nextInt(900000)));
        if (status == DocStatus.REJEITADO) e.setRejectionReason("CFOP inválido");
        repo.save(e);
      }
    };
  }
}
