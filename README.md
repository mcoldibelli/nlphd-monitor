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
