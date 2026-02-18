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

---

## Implementação via GTM + jsDelivr

### Passo 1 — Carregar o script via jsDelivr

Crie uma **Tag HTML Personalizado** no GTM com o código abaixo. Essa tag carrega o arquivo do GitHub via CDN do jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js"></script>
```

**Acionador (Trigger):** `Page View` filtrado para páginas que contenham `/products/travesseiro-snow` na URL.

> **Importante:** O jsDelivr cacheia o arquivo. Para forçar o cache bust após atualizações, use uma referência com commit hash ou tag de versão:
> ```
> https://cdn.jsdelivr.net/gh/mymetric/iws@COMMIT_HASH/iws-ab-tests.js
> ```

---

### Passo 2 — Ativar o teste desejado

Crie uma **segunda Tag HTML Personalizado** no GTM para chamar a função do teste que deseja rodar:

#### Teste 1: CTA com Benefício + Urgência

```html
<script>
  if (window.IWS_AB) {
    IWS_AB.ctaBeneficio();
  }
</script>
```

**O que faz:**
- Troca o texto do botão "Adicionar ao carrinho" para **"Quero dormir melhor"**
- Adiciona badge de urgência acima do botão: "Últimas unidades — Estoque limitado"
- Adiciona micro-copy de garantia abaixo: "Satisfação garantida por 30 dias"

---

#### Teste 2: Social Proof Dinâmico

```html
<script>
  if (window.IWS_AB) {
    IWS_AB.socialProof();
  }
</script>
```

**O que faz:**
- Exibe feed rotativo de compras recentes abaixo do formulário ("Maria de São Paulo comprou há 3 min")
- Mostra contador de vendas das últimas 24h
- Melhora o visual do indicador "pessoas vendo agora"

---

#### Teste 3: Checklist de Benefícios

```html
<script>
  if (window.IWS_AB) {
    IWS_AB.checklistBeneficios();
  }
</script>
```

**O que faz:**
- Insere bloco visual com 4 benefícios-chave acima do formulário de compra
- Inclui barra de confiança com rating (4.8 / 1.485 avaliações)

---

### Passo 3 — Configurar sequência de tags

No GTM, configure a tag do **Passo 2** para disparar **após** a tag do **Passo 1** usando **Sequenciamento de Tags**:

1. Edite a tag do Passo 2
2. Em **Configurações avançadas > Sequenciamento de tags**
3. Marque **"Disparar uma tag antes de..."** e selecione a tag do Passo 1

Isso garante que o script esteja carregado antes de chamar a função.

---

## Estrutura do GTM (resumo)

```
Tag 1: [HTML] Carregar iws-ab-tests.js via jsDelivr
  └─ Trigger: Page View — URL contém "/products/travesseiro-snow"

Tag 2: [HTML] Chamar IWS_AB.ctaBeneficio() (ou outra função)
  └─ Trigger: Page View — URL contém "/products/travesseiro-snow"
  └─ Sequenciamento: Disparar após Tag 1
```

---

## Dicas

- **Rode apenas 1 teste por vez** para não poluir os resultados.
- Use o **Preview Mode** do GTM para validar antes de publicar.
- Para combinar testes (ex: checklist + CTA), basta chamar as duas funções na mesma tag do Passo 2.
- Purge do cache jsDelivr: `https://purge.jsdelivr.net/gh/mymetric/iws@main/iws-ab-tests.js`
