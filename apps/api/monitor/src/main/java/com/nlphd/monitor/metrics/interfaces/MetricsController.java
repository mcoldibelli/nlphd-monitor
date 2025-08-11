package com.nlphd.monitor.metrics.interfaces;

import com.nlphd.monitor.metrics.application.GetMetricsOverviewUseCase;
import com.nlphd.monitor.metrics.application.MetricsOverviewDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/metrics")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MetricsController {
  private final GetMetricsOverviewUseCase useCase;

  @GetMapping("/overview")
  public MetricsOverviewDto overview() {
    return useCase.execute();
  }
}
