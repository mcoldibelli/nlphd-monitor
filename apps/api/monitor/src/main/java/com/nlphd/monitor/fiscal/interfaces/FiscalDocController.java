package com.nlphd.monitor.fiscal.interfaces;

import com.nlphd.monitor.fiscal.application.FiscalDocDto;
import com.nlphd.monitor.fiscal.application.ListFiscalDocsUseCase;
import com.nlphd.monitor.fiscal.application.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fiscal/docs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FiscalDocController {
  private final ListFiscalDocsUseCase listUseCase;

  @GetMapping
  public PagedResponse<FiscalDocDto> list(
      @RequestParam(defaultValue = "ALL") String status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    return listUseCase.execute(status, page, size);
  }
}
