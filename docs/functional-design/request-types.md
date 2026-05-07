# Request Types

## Lista MVP

| Código | Request type | Objetivo | Prioridade operacional |
|---|---|---|---|
| ABC-ACCESS | Acesso / permissões / utilizadores | Criar, alterar ou remover acessos. | Alta se bloquear operação. |
| ABC-FUNC-ERROR | Erro funcional | Reportar erro num processo BC. | Alta. |
| ABC-CONFIG | Issue de configuração | Corrigir parametrização. | Média/Alta. |
| ABC-MASTERDATA | Dados mestres | Criar/corrigir dados mestres. | Média. |
| ABC-FINANCE | Financeiro / faturação / cobranças | Resolver temas financeiros e documentos. | Alta. |
| ABC-PURCHASE | Compras | Apoiar encomendas, receções, faturas e aprovações. | Média/Alta. |
| ABC-SALES | Vendas | Apoiar propostas, encomendas, faturação e aprovações. | Alta. |
| ABC-LOGISTICS | Logística / expedição | Resolver stock, armazém, expedições e etiquetas. | Alta. |
| ABC-INTEGRATION | Integrações / importações / exportações | Resolver interfaces, ficheiros e web services. | Alta. |
| ABC-CHANGE | Pedido de melhoria / evolutivo | Qualificar alteração futura. | Baixa/Média. |

## Campos base

| Campo | Obrigatório | Tipo |
|---|---:|---|
| Empresa BC | Sim | Lista |
| Ambiente BC | Sim | Lista |
| Módulo / processo | Sim | Lista |
| Impacto | Sim | Lista |
| Urgência | Sim | Lista |
| Utilizador afetado | Condicional | Texto/User picker |
| Referência documento BC | Condicional | Texto |
| Resumo | Sim | Texto curto |
| Descrição detalhada | Sim | Texto longo |
| Passos para reproduzir | Condicional | Texto longo |
| Screenshot/anexo | Condicional | Anexo |
| Origem do pedido | Automático | Lista |
| Artigo KB sugerido | Automático | Link |
| Confiança IA | Automático | Número/lista |

## Critérios de fecho

Um pedido só deve ser marcado como resolvido quando:

- a causa ou orientação ficou registada;
- o utilizador recebeu resposta;
- foi indicada validação final;
- foi associado artigo KB quando aplicável;
- se não existir artigo KB e o tema for recorrente, foi criado candidato a artigo.
