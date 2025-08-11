package com.nlphd.monitor.sales.interfaces;

import com.nlphd.monitor.sales.application.ListRecentSalesOrdersUseCase;
import com.nlphd.monitor.sales.application.SalesOrderDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SalesOrderController {

  private final ListRecentSalesOrdersUseCase listRecent;

  @GetMapping
  public List<SalesOrderDto> list(@RequestParam(defaultValue = "10") int limit) {
    return listRecent.execute(limit);
  }
}
