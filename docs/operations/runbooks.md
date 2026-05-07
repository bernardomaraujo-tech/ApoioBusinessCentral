# Runbooks Operacionais

## 1. Pedido crítico

1. Validar empresa e ambiente BC.
2. Confirmar impacto operacional.
3. Classificar prioridade.
4. Verificar se existe artigo KB.
5. Encaminhar para agente responsável.
6. Atualizar ticket com diagnóstico.
7. Confirmar solução com utilizador.
8. Avaliar necessidade de artigo KB.

## 2. Falha de integração Business Central

1. Confirmar endpoint afetado.
2. Validar hora do erro.
3. Verificar logs da Integration API.
4. Confirmar autenticação.
5. Validar payload.
6. Reprocessar apenas se seguro.
7. Documentar causa e ação tomada.

## 3. Webhook BC sem atualização de ticket

1. Validar se webhook foi recebido.
2. Confirmar `clientState`.
3. Confirmar recurso no payload.
4. Verificar matching por referência de documento.
5. Rever dead-letter queue.
6. Reprocessar evento se aplicável.

## 4. Artigo KB incorreto

1. Marcar artigo como em revisão.
2. Validar com owner funcional.
3. Corrigir procedimento.
4. Atualizar labels/metadados.
5. Re-publicar.
6. Registar nota de alteração.
