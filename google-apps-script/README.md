# Backend de disponibilidade no Google Apps Script

Este script lê uma agenda Google e devolve somente os horários livres para o widget.

## Como publicar

1. Acesse <https://script.google.com/>.
2. Crie um novo projeto.
3. Cole o conteúdo de `Code.gs`.
4. Ajuste `CONFIG.calendarId`.
   - Use `primary` para a agenda principal da conta.
   - Ou use o ID de uma agenda específica em Google Calendar > Configurações da agenda > Integrar agenda > ID da agenda.
5. Ajuste `workingHours`, `appointmentMinutes`, `slotStepMinutes` e `minNoticeHours`.
6. Clique em `Implantar` > `Nova implantação`.
7. Tipo: `App da Web`.
8. Executar como: `Eu`.
9. Quem tem acesso: `Qualquer pessoa`.
10. Autorize o acesso à agenda.
11. Copie a URL terminada em `/exec`.

## Formato retornado

```js
callback({
  ok: true,
  timezone: 'America/Sao_Paulo',
  days: [
    { date: '2026-06-15', horarios: ['09:00', '10:00'] }
  ]
});
```
