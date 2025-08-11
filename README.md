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
