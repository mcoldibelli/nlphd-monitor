package com.nlphd.monitor.sales.infrastructure;

import java.math.BigDecimal;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.sales.simulation.enabled", havingValue = "true", matchIfMissing = true)
public class SalesOrderSimulator {
  private final SpringDataSalesOrderRepository repository;
  private final Random rnd = new Random();

  @Scheduled(
      fixedDelayString = "${app.sales.simulation.delay-ms}",
      initialDelayString = "${app.sales.simulation.initial-delay-ms}"
  )
  public void tick() {
    int n = rnd.nextInt(3) + 1;
    for (int i = 0; i< n; i++) {
      var e = new SalesOrderJpaEntity();
      e.setOrderNumber("SO-"+(1000+rnd.nextInt(90000)));
      var cents = 7990 + rnd.nextInt(82000);
      e.setTotalAmount(new BigDecimal(cents).movePointLeft(2));
      repository.save(e);
    }
  }

}
