# Widget de agendamento para Wix

Este repositório hospeda um widget HTML responsivo para publicar no GitHub Pages e incorporar no Wix via iframe.
Ele consulta a disponibilidade real da agenda Google por meio de um backend no Google Apps Script.

## Como publicar no GitHub Pages

1. No GitHub, abra `Settings` > `Pages`.
2. Em `Build and deployment`, selecione `Deploy from a branch`.
3. Escolha a branch `main` e a pasta `/root`.
4. Salve e aguarde o GitHub gerar a URL.

A URL final deve ficar assim:

```txt
https://alineangela.github.io/agendamento/
```

## Incorporar no Wix

No Wix, adicione um elemento `Incorporar HTML` e cole:

```html
<style>
  .agenda-frame {
    width: 100%;
    max-width: 100%;
    height: 1500px;
    border: 0;
    overflow: hidden;
  }

  @media (max-width: 420px) {
    .agenda-frame {
      height: 2150px;
    }
  }
</style>

<iframe
  class="agenda-frame"
  src="https://alineangela.github.io/agendamento/"
  title="Agenda de consultas"
  loading="lazy"
></iframe>
```

Se o Wix cortar o final do widget, aumente `height: 1500px` no desktop ou `height: 2150px` no bloco mobile.

## Agenda Google

O widget chama o Apps Script configurado em `index.html`:

```js
availabilityEndpoint: 'https://script.google.com/macros/s/AKfycbxFBI7Qa_lxZfPpRTSgzlK4vQxE-0nnDcxdBfnOYHMrBzqaaed1EbzGB0HNdlsW9HGM/exec'
```

Para mudar dias, horários, duração da consulta ou antecedência mínima, edite o projeto no Google Apps Script.
