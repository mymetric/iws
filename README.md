# IWS AB Tests — Travesseiro Snow

Scripts de testes A/B para a página [Travesseiro IWS Snow](https://www.iwannasleep.com.br/products/travesseiro-snow).

---

## Como funciona

O arquivo `iws-ab-tests.js` expõe 3 funções no objeto global `window.IWS_AB`. Cada função ativa um teste independente na página do produto.

| Função | Teste |
|---|---|
| `IWS_AB.ctaBeneficio()` | CTA orientado a benefício + urgência |
| `IWS_AB.socialProof()` | Feed de compras recentes + social proof |
| `IWS_AB.checklistBeneficios()` | Checklist de benefícios acima do CTA |
| `IWS_AB.pricingTest()` | Preços de controle (sem desconto) + redirects de kits |
| `IWS_AB.onProductPage(cb)` | Helper: executa `cb` só se a URL contiver `/products/` |

---

## Implementação via GTM + jsDelivr

Crie **uma única Tag HTML Personalizado** no GTM. O script é carregado dinamicamente e executa o teste após o carregamento — sem necessidade de sequenciamento de tags.

**Acionador (Trigger):** `Page View` filtrado para páginas que contenham `/products/travesseiro-snow` na URL.

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

## Estrutura do GTM (resumo)

```
Tag: [HTML Personalizado] AB Test — Travesseiro Snow
  └─ Carrega iws-ab-tests.js dinamicamente
  └─ Executa a função desejada no onload
  └─ Trigger: Page View — URL contém "/products/travesseiro-snow"
```

Uma única tag. Sem sequenciamento.

---

## Rodar em todas as páginas de produto

Quando o experimento deve cobrir qualquer URL de produto (`/products/*`) e não
um handle específico, gate a chamada com `IWS_AB.onProductPage` para evitar
sujar a amostra do experimento com pageviews fora de produto (home, coleção,
carrinho, etc.).

Exemplo dentro do fluxo do `experiment.js` da MyMetric:

```html
<script type="text/javascript">

  var mmtr_exp = document.createElement("script");
  mmtr_exp.src = "https://cdn.jsdelivr.net/gh/mymetric/scripts@main/experiment.js";
  mmtr_exp.onload = function() {
    var bucket = bucket_sort();
    new_experiment("fqTsL2RXwTR3SH9f", "Botão de Compra focado no Benefício", experiment_changes);
  };

  // Só carrega o experiment.js em páginas de produto
  if (window.location.pathname.indexOf('/products/') !== -1) {
    document.head.appendChild(mmtr_exp);
  }

  function experiment_original(exp_id) {}

  function experiment_changes(exp_id) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js';
    s.onload = function() {
      // Defesa em profundidade: garante que só roda em página de produto
      IWS_AB.onProductPage(function() { IWS_AB.ctaBeneficio(); });
    };
    document.head.appendChild(s);
  }

</script>
```

A checagem na injeção do `experiment.js` evita que pageviews irrelevantes entrem
no bucket; a checagem no `onload` do `iws-ab-tests.js` é defesa em profundidade
caso o snippet seja reutilizado em outra tag/trigger.

---

## Dicas

- **Rode apenas 1 teste por vez** para não poluir os resultados.
- Use o **Preview Mode** do GTM para validar antes de publicar.
- Purge do cache jsDelivr: `https://purge.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js`
- Para fixar uma versão específica, use commit hash: `https://cdn.jsdelivr.net/gh/mymetric/iws@COMMIT_HASH/iws-ab-tests.js`
