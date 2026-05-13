# IWS AB Tests — Travesseiro Snow

Scripts de testes A/B para a página [Travesseiro IWS Snow](https://www.iwannasleep.com.br/products/travesseiro-snow).

---

## Como funciona

O `iws-ab-tests.js` é carregado **direto no tema** (`<script src="https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js"></script>` no `<head>` do `theme.liquid`). Ele faz tudo sozinho — bucketing, sorteio 50/50, cookies sticky e impressão no `dataLayer` — **sem depender do GTM nem do `experiment.js` externo**.

### Testes com auto-launch

Listados em `ACTIVE_TESTS` no final do arquivo. Cada entrada roda automaticamente quando o pathname casa com `pathContains`. Hoje:

| ID do experimento | Nome | Path | Variante challenger |
|---|---|---|---|
| `oYzpu5HVygUoyj1o` | Botão de Compra focado no Benefício | `/products/` | `ctaBeneficio` |

**Para pausar** um teste: remova a entrada do array `ACTIVE_TESTS`, commit, push, [purge](#purge-cache) — propaga em segundos.
**Para adicionar** um teste: implemente a função `challenger`, adicione uma entrada no array com um `id` novo (qualquer string única).

### API pública (`window.IWS_AB`)

| Função | Uso |
|---|---|
| `IWS_AB.ctaBeneficio()` | CTA orientado a benefício + urgência |
| `IWS_AB.socialProof()` | Feed de compras recentes + social proof |
| `IWS_AB.checklistBeneficios()` | Checklist de benefícios acima do CTA |
| `IWS_AB.pricingTest()` | Preços de controle (sem desconto) + redirects de kits |
| `IWS_AB.onProductPage(cb)` | Executa `cb` só se a URL contiver `/products/` |
| `IWS_AB.runExperiment(id, name, challengerFn, originalFn?)` | Roda um experimento 50/50 com cookie sticky e impressão no dataLayer |

### Cookies setados

- `mm_exp_bucket` — bucket 0..10 sticky (365 dias). Compatível com o que o `experiment.js` da MyMetric setava.
- `mm_exp_id_<experimentId>` — `"<id>.<variant>"` sticky (365 dias). Ex.: `mm_exp_id_oYzpu5HVygUoyj1o=oYzpu5HVygUoyj1o.1`.

### Evento de impressão

Em cada pageview onde um experimento é executado, é enviado um evento `experiment_impression` via `gtag` (se existir) ou `dataLayer.push`:

```js
{
  event: 'experiment_impression',
  experiment_id: 'oYzpu5HVygUoyj1o',
  experiment_variant: '0' | '1',
  experiment_name: 'Botão de Compra focado no Benefício'
}
```

---

## Uso manual (legado / GTM)

Se ainda quiser disparar testes via GTM em vez de auto-launch, monte uma Tag HTML Personalizado. O `iws-ab-tests.js` já está no tema, então `IWS_AB` está disponível:

---

### Teste 1: CTA com Benefício + Urgência

```html
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js';
  s.onload = function() { IWS_AB.ctaBeneficio(); };
  document.head.appendChild(s);
})();
</script>
```

**O que faz:**
- Troca o texto do botão "Adicionar ao carrinho" para **"Quero dormir melhor"**
- Adiciona badge de urgência acima do botão: "Últimas unidades — Estoque limitado"
- Adiciona micro-copy de garantia abaixo: "Satisfação garantida por 30 dias"

---

### Teste 2: Social Proof Dinâmico

```html
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js';
  s.onload = function() { IWS_AB.socialProof(); };
  document.head.appendChild(s);
})();
</script>
```

**O que faz:**
- Exibe feed rotativo de compras recentes abaixo do formulário ("Maria de São Paulo comprou há 3 min")
- Mostra contador de vendas das últimas 24h
- Melhora o visual do indicador "pessoas vendo agora"

---

### Teste 3: Checklist de Benefícios

```html
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js';
  s.onload = function() { IWS_AB.checklistBeneficios(); };
  document.head.appendChild(s);
})();
</script>
```

**O que faz:**
- Insere bloco visual com 4 benefícios-chave acima do formulário de compra
- Inclui barra de confiança com rating (4.8 / 1.485 avaliações)

---

### Combinando testes

Para rodar mais de um teste ao mesmo tempo, chame múltiplas funções no `onload`:

```html
<script>
(function() {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js';
  s.onload = function() {
    IWS_AB.checklistBeneficios();
    IWS_AB.ctaBeneficio();
  };
  document.head.appendChild(s);
})();
</script>
```

---

## Validação no navegador

Abra qualquer URL `/products/*` em aba anônima e no Console:

```js
// Cookies setados pelo runner
document.cookie.split('; ').filter(c => c.indexOf('mm_exp') === 0)
// → ["mm_exp_bucket=7", "mm_exp_id_oYzpu5HVygUoyj1o=oYzpu5HVygUoyj1o.1"]

// Evento de impressão
dataLayer.filter(e => e.event === 'experiment_impression')
```

Se quiser forçar a variante para inspeção visual, edite o cookie manualmente
(`mm_exp_id_oYzpu5HVygUoyj1o=oYzpu5HVygUoyj1o.0` ou `...1`) e recarregue.

---

<a id="purge-cache"></a>
## Purge do cache jsDelivr

Após cada push em `main`, o jsDelivr ainda serve a versão cacheada por algum
tempo. Force a propagação imediata acessando:

```
https://purge.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js
```

Para fixar uma versão específica em vez de seguir `main`, use o commit hash:
`https://cdn.jsdelivr.net/gh/mymetric/iws@COMMIT_HASH/iws-ab-tests.js`
