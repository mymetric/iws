/**
 * IWS AB Tests — Travesseiro Snow
 * https://www.iwannasleep.com.br/products/travesseiro-snow
 *
 * Uso via jsDelivr + GTM:
 *   window.IWS_AB.ctaBeneficio();
 *   window.IWS_AB.socialProof();
 *   window.IWS_AB.checklistBeneficios();
 */

(function () {
  'use strict';

  // Utilitário: aguarda elemento no DOM e executa callback
  function waitFor(selector, callback, maxAttempts) {
    maxAttempts = maxAttempts || 50;
    var attempts = 0;
    var interval = setInterval(function () {
      var el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        callback(el);
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }

  // =============================================================
  // TESTE 1: CTA com Benefício + Urgência
  // =============================================================
  function ctaBeneficio() {
    waitFor('[id^="ProductSubmitButton"]', function (btn) {
      var form = btn.closest('form');
      if (!form) return;

      // Alterar texto do botão (preservar estrutura interna para o theme JS)
      var btnSpan = btn.querySelector('span');
      if (btnSpan) {
        btnSpan.textContent = 'Quero dormir melhor';
      } else {
        btn.textContent = 'Quero dormir melhor';
      }

      // Estilizar botão
      btn.style.fontSize = '18px';
      btn.style.letterSpacing = '0.5px';
      btn.style.transition = 'transform 0.2s ease';
      btn.addEventListener('mouseenter', function () {
        btn.style.transform = 'scale(1.03)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'scale(1)';
      });

      // Forçar flex-wrap no pai para os novos elementos quebrarem linha
      var parent = form.parentElement;
      parent.style.flexWrap = 'wrap';

      // Micro-copy de garantia abaixo do form
      var microCopy = document.createElement('div');
      microCopy.className = 'ab-test-microcopy';
      microCopy.style.cssText = 'width:100%;flex-basis:100%;order:9999;';
      microCopy.innerHTML =
        '<div style="text-align:center;margin-top:10px;' +
        'font-size:13px;color:#666;">' +
        '\uD83D\uDD12 Satisfação garantida por 30 dias ou seu dinheiro de volta' +
        '</div>';
      parent.insertBefore(microCopy, form.nextSibling);
    });
  }

  // =============================================================
  // TESTE 2: Social Proof Dinâmico — Compras Recentes
  // =============================================================
  function socialProof() {
    var purchases = [
      { name: 'Maria', city: 'São Paulo', time: '3 min' },
      { name: 'Carlos', city: 'Rio de Janeiro', time: '7 min' },
      { name: 'Ana', city: 'Belo Horizonte', time: '12 min' },
      { name: 'Pedro', city: 'Curitiba', time: '18 min' },
      { name: 'Juliana', city: 'Porto Alegre', time: '22 min' },
      { name: 'Lucas', city: 'Brasília', time: '31 min' },
      { name: 'Fernanda', city: 'Salvador', time: '45 min' },
      { name: 'Rafael', city: 'Florianópolis', time: '1 hora' },
    ];

    waitFor('[id^="product-form"]', function (form) {
      // Container do social proof
      var container = document.createElement('div');
      container.className = 'ab-social-proof';
      container.style.cssText =
        'margin-top:16px;padding:12px 16px;background:#F0FAF0;' +
        'border:1px solid #C3E6CB;border-radius:8px;font-size:13px;' +
        'color:#333;overflow:hidden;position:relative;min-height:44px;';

      var inner = document.createElement('div');
      inner.className = 'ab-social-proof-inner';
      inner.style.cssText = 'transition:opacity 0.4s ease;';
      container.appendChild(inner);

      form.parentElement.insertBefore(container, form.nextSibling);

      // Rotação de mensagens
      var currentIndex = 0;

      function render() {
        var p = purchases[currentIndex % purchases.length];
        inner.style.opacity = '0';

        setTimeout(function () {
          inner.innerHTML =
            '<span style="color:#28A745;font-weight:bold;">\u2713</span> ' +
            '<strong>' + p.name + '</strong> de ' + p.city +
            ' comprou o Travesseiro Snow há <strong>' + p.time + '</strong>';
          inner.style.opacity = '1';
        }, 400);

        currentIndex++;
      }

      render();
      setInterval(render, 4000);

      // Contador de vendas do dia
      var salesCount = Math.floor(Math.random() * 15) + 18;
      var salesBadge = document.createElement('div');
      salesBadge.style.cssText =
        'margin-top:8px;text-align:center;font-size:12px;color:#666;';
      salesBadge.innerHTML =
        '\uD83D\uDD25 <strong>' + salesCount +
        ' unidades vendidas</strong> nas últimas 24h';
      container.appendChild(salesBadge);

      // Melhorar visual do "pessoas vendo agora"
      var liveViews = document.querySelector('.iws-liveviews');
      if (liveViews) {
        liveViews.style.cssText =
          'background:#EEF4FF;border:1px solid #B8D4FE;border-radius:6px;' +
          'padding:8px 12px;margin-top:10px;text-align:center;' +
          'font-size:13px;color:#1A56DB;';
        var viewerNum = liveViews.querySelector('.iws-liveviews-number');
        if (viewerNum) {
          viewerNum.style.fontWeight = 'bold';
          viewerNum.style.fontSize = '15px';
        }
      }
    });
  }

  // =============================================================
  // TESTE 3: Checklist de Benefícios Acima do CTA
  // =============================================================
  function checklistBeneficios() {
    var benefits = [
      {
        icon: '\u2744\uFE0F',
        title: 'Tecnologia de resfriamento',
        desc: 'Gel + Bamboo mantêm a temperatura ideal a noite toda',
      },
      {
        icon: '\u2699\uFE0F',
        title: 'Altura 100% regulável',
        desc: 'Ajuste a quantidade de flocos para o seu conforto perfeito',
      },
      {
        icon: '\uD83D\uDEE1\uFE0F',
        title: '30 dias de teste grátis',
        desc: 'Não gostou? Devolvemos seu dinheiro, sem burocracia',
      },
      {
        icon: '\uD83D\uDE9A',
        title: 'Frete grátis para todo Brasil',
        desc: 'Entrega rápida e sem custo adicional',
      },
    ];

    waitFor('[id^="ProductSubmitButton"]', function (btn) {
      var form = btn.closest('form');
      if (!form) return;

      // Estilos
      var style = document.createElement('style');
      style.textContent =
        '.ab-benefits-checklist{' +
        'margin:16px 0;padding:16px;background:#FAFBFF;' +
        'border:1px solid #E8ECF4;border-radius:10px;}' +
        '.ab-benefits-checklist h3{' +
        'margin:0 0 12px;font-size:14px;font-weight:700;color:#333;' +
        'text-align:center;text-transform:uppercase;letter-spacing:0.5px;}' +
        '.ab-benefit-item{' +
        'display:flex;align-items:flex-start;gap:10px;padding:8px 0;' +
        'border-bottom:1px solid #F0F0F0;}' +
        '.ab-benefit-item:last-child{border-bottom:none;}' +
        '.ab-benefit-icon{font-size:20px;flex-shrink:0;width:28px;text-align:center;}' +
        '.ab-benefit-text strong{display:block;font-size:13px;color:#222;margin-bottom:2px;}' +
        '.ab-benefit-text span{font-size:12px;color:#777;line-height:1.3;}' +
        '.ab-trust-bar{' +
        'display:flex;justify-content:center;align-items:center;gap:6px;' +
        'margin-top:12px;padding-top:10px;border-top:1px solid #E8ECF4;' +
        'font-size:13px;color:#555;}' +
        '.ab-trust-bar .stars{color:#F5A623;font-size:15px;}';
      document.head.appendChild(style);

      // Construir checklist
      var checklist = document.createElement('div');
      checklist.className = 'ab-benefits-checklist';

      var heading = document.createElement('h3');
      heading.textContent = 'Por que escolher o Snow?';
      checklist.appendChild(heading);

      benefits.forEach(function (b) {
        var item = document.createElement('div');
        item.className = 'ab-benefit-item';
        item.innerHTML =
          '<div class="ab-benefit-icon">' + b.icon + '</div>' +
          '<div class="ab-benefit-text">' +
          '<strong>' + b.title + '</strong>' +
          '<span>' + b.desc + '</span></div>';
        checklist.appendChild(item);
      });

      // Barra de confiança com rating
      var trustBar = document.createElement('div');
      trustBar.className = 'ab-trust-bar';
      trustBar.innerHTML =
        '<span class="stars">\u2605\u2605\u2605\u2605\u2605</span>' +
        '<span>4.8 de 5 — avaliado por <strong>1.485 clientes</strong></span>';
      checklist.appendChild(trustBar);

      form.parentElement.insertBefore(checklist, form);
    });
  }

  // =============================================================
  // Expor funções globalmente
  // =============================================================
  window.IWS_AB = {
    ctaBeneficio: ctaBeneficio,
    socialProof: socialProof,
    checklistBeneficios: checklistBeneficios,
  };
})();
