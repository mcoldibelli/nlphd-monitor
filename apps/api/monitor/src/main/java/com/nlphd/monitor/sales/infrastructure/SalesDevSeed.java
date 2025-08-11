package com.nlphd.monitor.sales.infrastructure;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SalesDevSeed {

  private static final List<String> NAMES = List.of(
      "Cliente Demo", "Maria Souza", "João Silva", "Ana Clara", "Comercial XPTO"
  );

  @Bean
  CommandLineRunner seedSales(SpringDataSalesOrderRepository repo) {
    return args -> {
      if (repo.count() > 0) return;

      var rnd = new Random();
      for (int i = 1; i <= 8; i++) {
        var e = new SalesOrderJpaEntity();
        e.setOrderNumber("SO-" + (1000 + i));
        e.setTotalAmount(new BigDecimal(79.90 + rnd.nextInt(820)));
        repo.save(e);
      }
    };
  }
}
