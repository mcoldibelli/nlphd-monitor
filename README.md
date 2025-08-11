# NLPhd Vendas e Monitor fiscal

Painel para acompanhar **vendas do dia** e **status de documentos fiscais** (NF-e/NFC-e) em tempo quase real.

## Objetivo
- Consolidar métricas de vendas e documentos fiscais em uma única tela.
- Alertar rapidamente sobre **rejeições** e problemas de emissão.
- Arquitetura simples, modular e pronta para integrações.

## Stack
- Frontend: Next.js + Tailwind
- Backend: Java 21 + Spring Boot
- Banco: PostgreSQL (Docker)
- CI: GitHub Actions

----

### Endpoints — Sales
`GET /sales?limit=10`  
Retorna pedidos recentes.

**Parâmetros**
- `limit` (opcional, default 10): quantidade máxima de registros.

**Exemplo de resposta**
```json
[
  {
    "id": "e7b9f4f8-...-...",
    "orderNumber": "SO-1001",
    "totalAmount": 199.90,
    "createdAt": "2025-08-11T15:17:23Z"
  }
]
```

### Endpoints — Fiscal
`GET /fiscal/docs?status=ALL&page=0&size=20`  
Lista documentos fiscais recentes (ordenados por updatedAt desc).

**Parâmetros**
- `status` (opcional, padrão ALL): PROCESSANDO, AUTORIZADO, REJEITADO
- `page` (opcional, padrão 0): página (0-based)
- `size` (opcional, padrão 20): itens por página


**Exemplo de resposta**
```json
{
  "content": [
    {
      "id": "3a7b2c7e-aaaa-bbbb-cccc-999988887777",
      "orderId": "9b3f7d9a-dddd-eeee-ffff-111122223333",
      "docType": "NFCE",
      "status": "AUTORIZADO",
      "protocol": "PRT-123456",
      "rejectionReason": null,
      "updatedAt": "2025-08-11T14:02:51Z"
    }, ...
  ],
  "page": 0,
  "size": 5,
  "totalElements": 15
}
```

### Endpoints — Metrics
`GET /metrics/overview`  
Retorna um **resumo do dia** com métricas consolidadas de vendas e documentos fiscais.

**Propósito**
- Exibir no dashboard a visão rápida do dia atual: total de vendas, quantidade de pedidos e contagem de documentos por status.

**Janela temporal**
- Considera **o dia atual em UTC** (`00:00:00` até `23:59:59` UTC).  

**Resposta (200)**
```json
{
  "date": "2025-08-11",
  "sales": {
    "count": 8,
    "total": 2450.30
  },
  "fiscal": {
    "processando": 3,
    "autorizado": 9,
    "rejeitado": 2
  }
}
```

## Simulador de status fiscal (dev)

Para demonstrar o comportamento “quase em tempo real”, o backend possui um **simulador** que:
- Cria documentos fiscais `PROCESSANDO` quando a base está vazia.
- A cada *tick* promove até **5** documentos para:
  - `AUTORIZADO` (≈85%, gera `protocol`)
  - `REJEITADO` (≈15%, preenche `rejectionReason`)
- Ocasionalmente cria **novos** itens `PROCESSANDO` para manter a fila viva.

**Endpoints impactados**
- `GET /fiscal/docs` — você verá os itens mudando de status ao atualizar.
- `GET /metrics/overview` — contadores de `AUTORIZADO`, `REJEITADO` e `PROCESSANDO` variam com o tempo.

### Configuração
As flags ficam no `application.properties` (valores padrão pensados para dev):
```properties
app.simulation.enabled=true
app.simulation.delay=15s
app.simulation.initial-delay=3s
```
----

## Simulador de vendas (dev)

Para alimentar as métricas diárias, o backend possui um **simulador** que cria pedidos periodicamente.

**Comportamento**
- A cada *tick*, cria de **1 a 3 pedidos** (`SalesOrder`) com valores aleatórios.
- O campo `createdAt` é preenchido automaticamente no `@PrePersist`.
- Impacta diretamente o **/metrics/overview** (campos `sales.count` e `sales.total`) e a listagem **/sales**.

**Endpoints impactados**
- `GET /metrics/overview` — `sales.count` e `sales.total` variam com o tempo.
- `GET /sales?limit=10` — lista os pedidos mais recentes.

### Configuração
As flags ficam no `application.properties`:
```properties
app.sales.simulation.enabled=true
app.sales.simulation.delay=5s
app.sales.simulation.initial-delay=3s