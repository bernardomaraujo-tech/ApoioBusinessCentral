# Comunicação de documentos à AGT — executar fila de tarefas antes do envio

## Metadados

| Campo | Valor |
|---|---|
| ID | ABC-KB-001 |
| Categoria | Integrações |
| Visibilidade | Agente |
| Módulo BC | Financeiro / Faturação |
| Empresas aplicáveis | Todas |
| Ambientes aplicáveis | Produção |
| País/localização | Angola |
| Estado | Rascunho |
| Última revisão | 2026-05-07 |

## Problema

Antes de comunicar documentos à AGT, pode ser necessário executar a tarefa responsável pelo envio/processamento da comunicação eletrónica.

## Diagnóstico

Validar se a tarefa relacionada com o processo AGT está disponível em **Movs. Fila Tarefas** e se corresponde ao objeto esperado.

## Solução

Executar a tarefa em primeiro plano antes de avançar para a comunicação dos documentos.

## Procedimento

1. Abrir a pesquisa do Business Central.
2. Procurar por **Movs. Fila Tarefas**.
3. Localizar a tarefa relacionada com o processo AGT.
4. Confirmar os dados da tarefa.
5. Selecionar a linha.
6. Clicar em **Correr uma vez (em primeiro plano)**.
7. Aguardar a conclusão.

## Validação final

- A tarefa terminou sem erro.
- O processo de comunicação fica preparado para avançar.
- O ticket deve ser atualizado com a validação efetuada.

## Notas

Este artigo é um exemplo de estrutura e deve ser revisto antes de publicação.
