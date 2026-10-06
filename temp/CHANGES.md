# Tiago Estetele Terminal — registro de alterações

Arquivo: `Tiago Estetele Terminal.dc.html` (Design Component: template + classe `Component extends DCLogic`).

Não guardei uma cópia da versão original, então não dá para gerar um diff linha a linha. Este documento lista **cada mudança** e traz o **código final** de todas as partes alteradas. Partes que não aparecem aqui ficaram como estavam: barra de título da janela, shell da janela, barra do prompt e status bar.

---

## 1. Resumo das mudanças (em ordem)

1. **Cursor customizado**: ponto + anel com movimento suave (lerp). O anel aumenta sobre `button`/`a`. O cursor nativo fica oculto com `cursor: none` só quando há `pointer: fine` e sem reduced-motion.
2. **Fundo animado** (canvas fixo atrás de tudo). Versão final: um **grafo git vivo**. Lanes horizontais rolam para a esquerda, branches fazem fork e merge, os commits são quadrados e os de merge são preenchidos. Perto do mouse, o grafo brilha (gradiente radial) e o commit mais próximo mostra um label `sha  mensagem`. Clique nas margens cria o commit "feat: visitor was here". Cada navegação (`cd ~/x`) cria um commit destacado na borda direita via `this._bgCommit(text)`. As versões anteriores (matriz binária e curvas de nível) foram substituídas.
3. **Painel de ajuda**: botão flutuante "?" no canto inferior direito, que abre o painel "man portfolio" com navegação e comandos (EN/BR).
4. **Abas de navegação** só aparecem depois do boot (opacity/translate condicionados a `booting`).
5. **Boot**: linhas com fade e o comando final `./portfolio --start` digitado caractere a caractere. Modos `cinematic` / `instant` / `verbose` (tweak).
6. **Terminal mais realista**: histórico com ↑/↓, cursor reinicia o piscar a cada tecla, novos comandos `pwd`, `date`, `history`, `echo`, `man` (abre a ajuda).
7. **Tweaks** (props): `backgroundMode` (graph/quiet/off), `bootMode` (cinematic/instant/verbose), `cursorStyle` (ring/block/system).
8. **Formação acadêmica** no about (UNIP + FAMEF), hoje exibida como `tree ./education`.
9. **Home redesenhada** como sessão de terminal: `neofetch` com monograma ASCII "TE" em duas camadas (blocos + sombra), `cat intro.md` com h1 em mono e destaque invertido na palavra IA, e um menu estilo inquirer (`cd ~/contact`, `cd ~/stack`) com barra de seleção invertida. Sem cantos arredondados.
10. **Todas as páginas no mesmo padrão**: prompt com comando digitado (keyframe `typeIn` com clip-path + steps), saída surgindo depois (`appear`) e títulos markdown `# `.
    - **about**: `cat about.md` + `tree ./education`.
    - **stack**: `cat README.md` + `ls -la ./stack`.
    - **projects**: lista + **painel de preview ao vivo** (iframe a 400% escalado 0.25 num quadrado). O hover troca o projeto (debounce de 160 ms), iframes visitados ficam montados, há overlay "connecting…" com loadbar até o `onLoad` e fallback de 10 s.
    - **experience**: UI estilo **tig**. Lista de commits (data, nó, sha, decoração de branch, cargo) com mini-timeline proporcional de 2022 até hoje, status bar `[main] sha — commit n of 5` e painel inferior `git show` (Org/Date/Where, descrição completa do LinkedIn, skills como `+ skill`). A troca de cargo é **só por clique**.
    - **cargo atual (NDA)**: em vez de descrição, mostra um `git show --stat` com nomes de arquivo censurados (█), "erro: acesso restrito — este commit está sob NDA" e a nota "# os detalhes serão liberados quando o projeto for público".
    - **contact**: `cat README.md` + `./contact.sh` com menu inquirer (email/github/linkedin).
    - **404**: sessão `cd ~/x` → erro → `echo $?` → ASCII art "404" + botão `cd ~/home`.
11. **Dados atualizados**: experiências conforme o LinkedIn (Brivia Full Stack Pleno atual + Front End, Polo BPM, OKN Front-end, OKN Estágio), com períodos, durações, local e skills. O `nfWork` da home virou "Full Stack Developer (Mid-level) @ Brivia". O cargo atual tem as skills PHP, JavaScript, HTML, CSS/SCSS, WordPress e SEO.
12. **Fix**: `componentDidUpdate` não recebe `prevState` neste runtime, então a página anterior é rastreada em `this._lastPage` (inicializado no `componentDidMount`).

---

## 2. CSS global (`<helmet><style>`)
Novos: regra `cursor: none`, keyframes `fadeUp`, `appear`, `typeIn`, `loadbar` e a classe `.tnum`.
```html
<style>
    body { margin: 0; background: #050505; color: #e8e8e5; font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif; -webkit-font-smoothing: antialiased; overflow: hidden; }
    @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
      body, body a, body button { cursor: none; }
    }
    ::selection { background: rgba(74,222,128,0.25); color: #eafff0; }
    a { color: #4ade80; text-decoration: none; }
    a:hover { color: #86efac; }
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes appear { from { opacity: 0; } to { opacity: 1; } }
    @keyframes typeIn { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes loadbar { from { width: 0; } to { width: 92%; } }
    .tnum { font-variant-numeric: tabular-nums; }
  </style>
```


## 3. Props / Tweaks (`data-props`)
```json
{
  "backgroundMode": { "editor": "enum", "default": "graph", "options": ["graph", "quiet", "off"], "tsType": "string", "section": "Feel" },
  "bootMode": { "editor": "enum", "default": "cinematic", "options": ["cinematic", "instant", "verbose"], "tsType": "string", "section": "Feel" },
  "cursorStyle": { "editor": "enum", "default": "ring", "options": ["ring", "block", "system"], "tsType": "string", "section": "Feel" }
}
```


## 4. Template: cursor, painel de ajuda e botão "?"
```html
<!-- custom cursor -->
<div ref="{{ cursorRingRef }}" style="position: fixed; left: 0; top: 0; z-index: 100; pointer-events: none; width: 34px; height: 34px; margin: -17px 0 0 -17px; border: 1px solid rgba(74,222,128,0.55); border-radius: 50%; opacity: 0; transition: width 0.25s ease, height 0.25s ease, margin 0.25s ease, border-color 0.25s ease, background 0.25s ease;"></div>
<div ref="{{ cursorDotRef }}" style="position: fixed; left: 0; top: 0; z-index: 100; pointer-events: none; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,0.7); opacity: 0;"></div>

<!-- help panel -->
<sc-if value="{{ helpOpen }}" hint-placeholder-val="{{ false }}">
  <div style="position: fixed; right: 22px; bottom: 84px; z-index: 50; width: min(340px, calc(100vw - 44px)); max-height: calc(100vh - 130px); overflow-y: auto; border: 1px solid #223528; border-radius: 12px; background: rgba(9,12,10,0.97); backdrop-filter: blur(14px); box-shadow: 0 24px 70px rgba(0,0,0,0.7); padding: 18px 20px; box-sizing: border-box;">
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px;">
      <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #4ade80; letter-spacing: 0.06em;">man portfolio</span>
      <button onClick="{{ toggleHelp }}" style="border: none; background: transparent; color: #565650; font-family: 'JetBrains Mono', monospace; font-size: 14px; cursor: pointer; padding: 2px 6px; transition: color 0.2s ease;" style-hover="color: #4ade80;">✕</button>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #4ade80; letter-spacing: 0.08em; margin-bottom: 8px;">## {{ t.helpNavTitle }}</div>
    <p style="font-size: 13px; line-height: 1.65; color: #9a9a94; margin: 0 0 16px; font-family: 'Space Grotesk', sans-serif;">{{ t.helpNavBody }}</p>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #4ade80; letter-spacing: 0.08em; margin-bottom: 8px;">## {{ t.helpCmdTitle }}</div>
    <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px;">
      <sc-for list="{{ helpCmds }}" as="cmd" hint-placeholder-count="5">
        <div style="display: grid; grid-template-columns: 96px 1fr; gap: 10px; align-items: baseline;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e8e8e5; background: #0e0e0e; border: 1px solid #1e1e1e; border-radius: 5px; padding: 3px 7px; text-align: center;">{{ cmd.cmd }}</span>
          <span style="font-size: 12px; line-height: 1.5; color: #8a8a84;">{{ cmd.desc }}</span>
        </div>
      </sc-for>
    </div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #565650; line-height: 1.7; border-top: 1px solid #161616; padding-top: 12px;">{{ t.helpTip }}</div>
  </div>
</sc-if>

<!-- floating help button -->
<button onClick="{{ toggleHelp }}" aria-label="Help" style="position: fixed; right: 22px; bottom: 22px; z-index: 50; width: 46px; height: 46px; border-radius: 50%; border: 1px solid {{ helpBtnBorder }}; background: {{ helpBtnBg }}; color: {{ helpBtnColor }}; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.2s ease, border-color 0.25s ease, background 0.25s ease, color 0.25s ease, box-shadow 0.3s ease;" style-hover="border-color: #2e4a38; color: #4ade80; transform: translateY(-2px); box-shadow: 0 14px 38px rgba(74,222,128,0.18);" style-active="transform: scale(0.92);">?</button>
```


## 5. Template: abas (ocultas durante o boot)
```html
<!-- nav tabs -->
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; border-bottom: 1px solid #141414; background: #090909; flex-shrink: 0; flex-wrap: wrap; opacity: {{ navOpacity }}; pointer-events: {{ navPointer }}; transform: translateY({{ navShift }}); transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);">
      <div style="display: flex; align-items: center; gap: 2px; flex-wrap: wrap;">
        <sc-for list="{{ tabs }}" as="tab" hint-placeholder-count="6">
          <button onClick="{{ tab.go }}" style="font-family: 'JetBrains Mono', monospace; font-size: 12px; border: 1px solid {{ tab.border }}; cursor: pointer; padding: 6px 12px; border-radius: 6px; background: {{ tab.bg }}; color: {{ tab.color }}; transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;" style-hover="color: #4ade80; background: #0e0e0e; transform: translateY(-1px);" style-active="transform: scale(0.95);">{{ tab.label }}</button>
        </sc-for>
      </div>
      <div style="display: flex; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; border: 1px solid #1e1e1e; border-radius: 6px; overflow: hidden;">
        <button onClick="{{ setEn }}" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; border: none; cursor: pointer; padding: 5px 9px; background: {{ enBg }}; color: {{ enColor }}; transition: background 0.2s ease, color 0.2s ease;" style-hover="color: #4ade80;">/en</button>
        <button onClick="{{ setBr }}" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; border: none; cursor: pointer; padding: 5px 9px; background: {{ brBg }}; color: {{ brColor }}; transition: background 0.2s ease, color 0.2s ease;" style-hover="color: #4ade80;">/br</button>
      </div>
    </div>
```


## 6. Template: boot
```html
<!-- boot sequence -->
    <sc-if value="{{ booting }}" hint-placeholder-val="{{ false }}">
      <div style="flex: 1; overflow-y: auto; padding: clamp(20px, 4vw, 40px); font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 2;">
        <sc-for list="{{ bootLines }}" as="line" hint-placeholder-count="3">
          <div style="color: {{ line.color }}; animation: fadeUp 0.32s ease both;"><span style="color: #4ade80;">{{ line.tag }}</span> {{ line.text }}</div>
        </sc-for>
        <sc-if value="{{ bootTyping }}" hint-placeholder-val="{{ false }}">
          <div style="color: #e8e8e5; animation: fadeUp 0.32s ease both;">{{ bootTypedCmd }}<span style="display: inline-block; width: 8px; height: 15px; background: #4ade80; margin-left: 1px; animation: blink 1s step-end infinite; vertical-align: -2px;"></span></div>
        </sc-if>
      </div>
    </sc-if>
```


## 7. Template: wrapper do conteúdo
```html
<!-- content viewport -->
    <sc-if value="{{ notBooting }}" hint-placeholder-val="{{ true }}">
    <div style="flex: 1; overflow-y: auto; padding: clamp(20px, 4vw, 40px); opacity: {{ contentOpacity }}; transform: translateY({{ contentShift }}); transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1);">
```


## 8. Template: páginas
### 8.1 Home
```html
<!-- HOME -->
      <sc-if value="{{ isHome }}" hint-placeholder-val="{{ true }}">
        <div data-screen-label="Home" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px; max-width: 860px;">

          <!-- $ neofetch -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/home$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.24s steps(8, end) 0.1s both;">neofetch</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 20px 44px; animation: appear 0.12s ease-out 0.42s both;">
              <div aria-hidden="true" style="display: grid; flex-shrink: 0; font-family: Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace; font-size: 16px; line-height: 1.15; user-select: none;">
                <div style="grid-area: 1 / 1; color: #4ade80;">
                  <sc-for list="{{ artFill }}" as="ln" hint-placeholder-count="6"><div style="white-space: pre;">{{ ln }}</div></sc-for>
                </div>
                <div style="grid-area: 1 / 1; color: #2d6142;">
                  <sc-for list="{{ artShade }}" as="ln" hint-placeholder-count="6"><div style="white-space: pre;">{{ ln }}</div></sc-for>
                </div>
              </div>
              <div style="flex: 1 1 300px; min-width: 0; font-size: 13px; line-height: 20px;">
                <div><span style="color: #4ade80; font-weight: 600;">tiago</span><span style="color: #565650;">@</span><span style="color: #4ade80; font-weight: 600;">estetele</span></div>
                <div style="color: #3a3a36;">--------------</div>
                <div style="display: grid; grid-template-columns: 9ch minmax(0, 1fr); column-gap: 12px;">
                  <span style="color: #4ade80;">role</span>
                  <span style="color: #c9c9c3;">{{ t.nfRole }}</span>
                  <span style="color: #4ade80;">work</span>
                  <span style="color: #c9c9c3;">{{ t.nfWork }}</span>
                  <span style="color: #4ade80;">stack</span>
                  <span style="color: #c9c9c3;">React · Next.js · TypeScript · Node.js</span>
                  <span style="color: #4ade80;">location</span>
                  <span style="color: #c9c9c3;">{{ t.nfLocation }}</span>
                  <span style="color: #4ade80;">status</span>
                  <span style="display: flex; align-items: center; gap: 8px; color: #c9c9c3;"><span style="width: 7px; height: 7px; flex-shrink: 0; background: #4ade80; animation: pulse-dot 2.4s ease-in-out infinite;"></span>{{ t.nfStatus }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- $ cat intro.md -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.62s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/home$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.34s steps(12, end) 0.7s both;">cat intro.md</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; animation: appear 0.12s ease-out 1.1s both;">
              <h1 style="font-size: clamp(22px, 2.8vw, 28px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; color: #e8e8e5; margin: 0; max-width: 42ch; text-wrap: balance;"><span style="color: #3f7f55;">#&nbsp;</span>{{ t.headline1 }} <span style="background: #4ade80; color: #050505; padding: 0 0.14em; -webkit-box-decoration-break: clone; box-decoration-break: clone;">{{ t.headlineAI }}</span>.</h1>
              <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 80ch; text-wrap: pretty;">{{ t.heroSub }}</p>
            </div>
          </div>

          <!-- interactive prompt -->
          <div style="display: flex; flex-direction: column; gap: 10px; animation: appear 0.12s ease-out 1.28s both;">
            <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 13px; line-height: 20px;">
              <span style="color: #4ade80; font-weight: 600;">?</span>
              <span style="color: #e8e8e5; font-weight: 500;">{{ t.homeAsk }}</span>
              <span style="color: #6b6b65; font-size: 12px;">{{ t.homeAskHint }}</span>
            </div>
            <div style="display: flex; flex-direction: column; max-width: 540px;">
              <button onClick="{{ goContact }}" onMouseEnter="{{ selHome0 }}" onFocus="{{ selHome0 }}" style="display: grid; grid-template-columns: 2ch 14ch minmax(0, 1fr); align-items: center; column-gap: 10px; width: 100%; margin: 0; padding: 6px 10px; border: none; border-radius: 0; outline: none; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 18px; cursor: pointer; background: {{ home0.bg }}; color: {{ home0.fg }}; transition: background 0.06s linear, color 0.06s linear;">
                <span style="color: {{ home0.ptr }};">&gt;</span>
                <span>cd ~/contact</span>
                <span style="color: {{ home0.sub }};">{{ t.ctaContact }}</span>
              </button>
              <button onClick="{{ goStack }}" onMouseEnter="{{ selHome1 }}" onFocus="{{ selHome1 }}" style="display: grid; grid-template-columns: 2ch 14ch minmax(0, 1fr); align-items: center; column-gap: 10px; width: 100%; margin: 0; padding: 6px 10px; border: none; border-radius: 0; outline: none; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 18px; cursor: pointer; background: {{ home1.bg }}; color: {{ home1.fg }}; transition: background 0.06s linear, color 0.06s linear;">
                <span style="color: {{ home1.ptr }};">&gt;</span>
                <span>cd ~/stack</span>
                <span style="color: {{ home1.sub }};">{{ t.ctaStack }}</span>
              </button>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.2 About
```html
<!-- ABOUT -->
      <sc-if value="{{ isAbout }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="About" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px; max-width: 860px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/about$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.36s steps(12, end) 0.08s both;">cat about.md</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; animation: appear 0.12s ease-out 0.52s both;">
              <h1 style="font-size: clamp(22px, 2.8vw, 28px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; color: #e8e8e5; margin: 0; max-width: 42ch; text-wrap: balance;"><span style="color: #3f7f55;">#&nbsp;</span>{{ t.aboutTitle }}</h1>
              <p style="font-size: 14px; line-height: 1.75; color: #c9c9c3; margin: 0; max-width: 78ch; text-wrap: pretty;">{{ t.about1 }}</p>
              <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 78ch; text-wrap: pretty;">{{ t.about2 }}</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.72s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/about$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.48s steps(16, end) 0.8s both;">tree ./education</span>
            </div>
            <div style="display: flex; flex-direction: column; font-size: 13px; line-height: 21px; animation: appear 0.12s ease-out 1.36s both;">
              <div style="color: #c9c9c3;">./education</div>
              <sc-for list="{{ eduTree }}" as="edu" hint-placeholder-count="2">
                <div style="display: flex;">
                  <span style="flex-shrink: 0; white-space: pre; color: #3a3a36; font-family: Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;">{{ edu.p1 }}</span>
                  <span style="display: flex; flex-wrap: wrap; gap: 0 14px; min-width: 0;"><span style="color: #4ade80;">{{ edu.dir }}</span><span style="color: #6b6b65;">{{ edu.period }}</span></span>
                </div>
                <div style="display: flex;">
                  <span style="flex-shrink: 0; white-space: pre; color: #3a3a36; font-family: Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;">{{ edu.p2 }}</span>
                  <span style="color: #e8e8e5; min-width: 0;">{{ edu.course }}</span>
                </div>
                <div style="display: flex;">
                  <span style="flex-shrink: 0; white-space: pre; color: #3a3a36; font-family: Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;">{{ edu.p3 }}</span>
                  <span style="color: #8a8a84; min-width: 0;">{{ edu.tags }}</span>
                </div>
              </sc-for>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.3 Stack
```html
<!-- STACK -->
      <sc-if value="{{ isStack }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="Stack" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px; max-width: 860px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/stack$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.39s steps(13, end) 0.08s both;">cat README.md</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; animation: appear 0.12s ease-out 0.55s both;">
              <h1 style="font-size: clamp(22px, 2.8vw, 28px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; color: #e8e8e5; margin: 0; max-width: 42ch; text-wrap: balance;"><span style="color: #3f7f55;">#&nbsp;</span>{{ t.stackPill }}</h1>
              <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 78ch; text-wrap: pretty;">{{ t.stackSub }}</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.72s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/stack$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.42s steps(14, end) 0.8s both;">ls -la ./stack</span>
            </div>
            <div style="display: flex; flex-direction: column; font-size: 13px; line-height: 20px; animation: appear 0.12s ease-out 1.3s both;">
              <div style="color: #565650; padding-bottom: 4px;">total {{ stackTotal }}</div>
              <sc-for list="{{ stackModules }}" as="mod" hint-placeholder-count="6">
                <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 18px; padding: 5px 10px; margin: 0 -10px; transition: background 0.06s linear;" style-hover="background: #0e0e0e;">
                  <span style="display: flex; gap: 14px; flex-shrink: 0;">
                    <span style="color: #3a3a36;">drwxr-xr-x</span>
                    <span style="color: #565650; width: 2ch; text-align: right;">{{ mod.count }}</span>
                    <span style="color: #4ade80; width: 10ch;">{{ mod.dir }}</span>
                  </span>
                  <span style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 14px; flex: 1 1 280px; min-width: 0;">
                    <sc-for list="{{ mod.techs }}" as="tech" hint-placeholder-count="4"><span style="color: #c9c9c3;">{{ tech }}</span></sc-for>
                    <span style="color: #3f7f55; margin-left: auto;"># {{ mod.sub }}</span>
                  </span>
                </div>
              </sc-for>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.4 Projects (preview ao vivo)
```html
<!-- PROJECTS -->
      <sc-if value="{{ isProjects }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="Projects" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 24px 32px;">
          <div style="flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/projects$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.39s steps(13, end) 0.08s both;">cat README.md</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; animation: appear 0.12s ease-out 0.55s both;">
              <h1 style="font-size: clamp(22px, 2.8vw, 28px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; color: #e8e8e5; margin: 0; max-width: 42ch; text-wrap: balance;"><span style="color: #3f7f55;">#&nbsp;</span>{{ t.projectsPill }}</h1>
              <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 78ch; text-wrap: pretty;">{{ t.projectsSub }}</p>
            </div>
          </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.72s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/projects$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.69s steps(23, end) 0.8s both;">ls ./projects --preview</span>
            </div>
              <div style="display: flex; flex-direction: column; animation: appear 0.12s ease-out 1.57s both;">
                <sc-for list="{{ projects }}" as="proj" hint-placeholder-count="5">
                  <a href="{{ proj.url }}" target="_blank" rel="noopener" onMouseEnter="{{ proj.select }}" onFocus="{{ proj.select }}" style="display: grid; grid-template-columns: 2ch 2ch minmax(0, 1fr); column-gap: 10px; padding: 7px 10px; outline: none; text-decoration: none; background: {{ proj.bg }}; color: {{ proj.fg }}; transition: background 0.06s linear, color 0.06s linear;">
                    <span style="color: {{ proj.ptr }}; font-size: 13px; line-height: 19px;">&gt;</span>
                    <span style="color: {{ proj.sub }}; font-size: 13px; line-height: 19px;">{{ proj.idx }}</span>
                    <span style="display: flex; flex-direction: column; gap: 1px; min-width: 0;">
                      <span style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 12px; font-size: 13px; line-height: 19px;">
                        <span style="font-weight: 600;">{{ proj.name }}</span>
                        <span style="color: {{ proj.sub }}; font-size: 11px;">{{ proj.domain }}</span>
                      </span>
                      <span style="color: {{ proj.sub }}; font-size: 12px; line-height: 18px;">{{ proj.desc }}</span>
                    </span>
                  </a>
                </sc-for>
              </div>
            </div>
          </div>

          <!-- live preview pane -->
          <div style="flex: 0 1 320px; min-width: 260px; position: sticky; top: 0; display: flex; flex-direction: column; border: 1px solid #1c1c1c; background: #070707; animation: appear 0.12s ease-out 0.55s both;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 10px; border-bottom: 1px solid #161616; background: #0b0b0b; font-size: 11px; line-height: 16px;">
              <span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #6b6b65;">preview — <span style="color: #c9c9c3;">{{ projActive.domain }}</span></span>
              <span style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; color: {{ projStatusColor }};"><span style="width: 6px; height: 6px; background: {{ projStatusColor }}; animation: pulse-dot 1.6s ease-in-out infinite;"></span>{{ projStatus }}</span>
            </div>
            <a href="{{ projActive.url }}" target="_blank" rel="noopener" aria-label="{{ projActive.name }}" style="position: relative; display: block; aspect-ratio: 1 / 1; overflow: hidden; background: #050505;">
              <sc-for list="{{ projFrames }}" as="fr" hint-placeholder-count="1">
                <sc-if value="{{ fr.mounted }}" hint-placeholder-val="{{ false }}">
                  <iframe src="{{ fr.url }}" title="{{ fr.name }}" onLoad="{{ fr.onLoad }}" sandbox="allow-scripts allow-same-origin" style="position: absolute; top: 0; left: 0; width: 400%; height: 400%; border: 0; transform: scale(0.25); transform-origin: 0 0; pointer-events: none; background: #ffffff; opacity: {{ fr.opacity }}; z-index: {{ fr.z }}; transition: opacity 0.25s ease;"></iframe>
                </sc-if>
              </sc-for>
              <sc-if value="{{ projLoadingNow }}" hint-placeholder-val="{{ true }}">
                <div key="{{ projActive.domain }}" style="position: absolute; inset: 0; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 16px; background: #070707; font-size: 11px; line-height: 16px;">
                  <span style="color: #565650;">$ preview {{ projActive.url }}</span>
                  <span style="color: #c9c9c3;">connecting to {{ projActive.domain }}…</span>
                  <span style="position: relative; height: 6px; background: #141414; overflow: hidden;"><span style="position: absolute; top: 0; bottom: 0; left: 0; background: #4ade80; animation: loadbar 2.6s cubic-bezier(0.1, 0.7, 0.2, 1) both;"></span></span>
                </div>
              </sc-if>
            </a>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 10px; border-top: 1px solid #161616; font-size: 11px; line-height: 16px;">
              <span style="color: #565650; min-width: 0;">{{ t.projHint }}</span>
              <a href="{{ projActive.url }}" target="_blank" rel="noopener" style="color: #4ade80; flex-shrink: 0;">open ↗</a>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.5 Experience (tig + NDA)
```html
<!-- EXPERIENCE -->
      <sc-if value="{{ isExperience }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="Experience" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/experience$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.36s steps(12, end) 0.08s both;">tig --career</span>
            </div>
            <div style="display: flex; flex-direction: column; border: 1px solid #1c1c1c; background: #070707; animation: appear 0.12s ease-out 0.52s both;">
              <div style="display: flex; flex-direction: column; padding: 8px 0 6px;">
                <div style="display: grid; grid-template-columns: minmax(0, 1fr) clamp(130px, 28%, 260px); column-gap: 18px; padding: 0 12px 4px; font-size: 10px; line-height: 14px; color: #3a3a36;">
                  <span></span>
                  <span style="position: relative; height: 14px;">
                    <sc-for list="{{ expTicks }}" as="tk" hint-placeholder-count="4"><span style="position: absolute; top: 0; left: {{ tk.left }}; transform: translateX(-50%);">{{ tk.label }}</span></sc-for>
                  </span>
                </div>
                <sc-for list="{{ expRows }}" as="row" hint-placeholder-count="5">
                  <button onClick="{{ row.select }}" style="display: grid; grid-template-columns: minmax(0, 1fr) clamp(130px, 28%, 260px); column-gap: 18px; align-items: center; width: 100%; margin: 0; padding: 5px 12px; border: none; border-radius: 0; outline: none; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 18px; cursor: pointer; background: {{ row.bg }}; color: {{ row.fg }}; transition: background 0.06s linear, color 0.06s linear;">
                    <span style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                      <span style="flex-shrink: 0; color: {{ row.sub }};">{{ row.date }}</span>
                      <span style="flex-shrink: 0; width: 7px; height: 7px; background: {{ row.node }};"></span>
                      <span style="flex-shrink: 0; color: {{ row.idC }};">{{ row.id }}</span>
                      <span style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span style="color: {{ row.deco }};">{{ row.decoText }}</span>{{ row.role }}</span>
                    </span>
                    <span style="position: relative; height: 8px; background: {{ row.track }};"><span style="position: absolute; top: 0; bottom: 0; left: {{ row.left }}; width: {{ row.width }}; background: {{ row.bar }};"></span></span>
                  </button>
                </sc-for>
              </div>
              <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; padding: 4px 12px; background: #141414; font-size: 11px; line-height: 16px; color: #8a8a84;">
                <span>[main] <span style="color: #4ade80;">{{ expActive.id }}</span> — {{ expActive.pos }}</span>
                <span style="color: #565650;">{{ t.expHint }}</span>
              </div>
              <div key="{{ expActive.id }}" style="max-height: 270px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #2a2a27 transparent; padding: 14px 16px 16px; font-size: 13px; line-height: 21px; animation: appear 0.15s ease-out both;">
                <div style="color: #4ade80;">commit {{ expActive.id }} <span style="color: #86efac;">{{ expActive.decoText }}</span></div>
                <div style="display: grid; grid-template-columns: 7ch minmax(0, 1fr); column-gap: 8px; color: #c9c9c3;">
                  <span style="color: #565650;">Org:</span><span>{{ expActive.org }}</span>
                  <span style="color: #565650;">Date:</span><span>{{ expActive.period }}</span>
                  <span style="color: #565650;">Where:</span><span>{{ expActive.where }}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px; padding-left: 4ch;">
                  <div style="color: #e8e8e5; font-weight: 600;">{{ expActive.role }}</div>
                  <sc-for list="{{ expActive.desc }}" as="para" hint-placeholder-count="2"><p style="margin: 0; color: #8a8a84; max-width: 92ch; text-wrap: pretty;">{{ para }}</p></sc-for>
                  <sc-if value="{{ expActive.redacted }}" hint-placeholder-val="{{ false }}">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                      <div style="color: #565650;">$ git show {{ expActive.id }} --stat</div>
                      <div style="color: #f87171;">{{ t.ndaErr }}</div>
                      <div style="display: grid; grid-template-columns: minmax(0, max-content) auto auto; column-gap: 12px; justify-content: start;">
                        <span style="color: #8a8a84; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">src/█████████/███████.js</span><span style="color: #3a3a36;">|</span><span style="white-space: nowrap;"><span style="color: #565650;">██</span> <span style="color: #4ade80;">++++++++++</span><span style="color: #f87171;"></span></span>
                        <span style="color: #8a8a84; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">api/███████████.php</span><span style="color: #3a3a36;">|</span><span style="white-space: nowrap;"><span style="color: #565650;">███</span> <span style="color: #4ade80;">++++++</span><span style="color: #f87171;">--</span></span>
                        <span style="color: #8a8a84; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">styles/██████/█████.scss</span><span style="color: #3a3a36;">|</span><span style="white-space: nowrap;"><span style="color: #565650;">██</span> <span style="color: #4ade80;">++++</span><span style="color: #f87171;">-</span></span>
                      </div>
                      <div style="color: #8a8a84;">3 files changed, <span style="color: #565650;">███</span> insertions(+), <span style="color: #565650;">██</span> deletions(-)</div>
                      <div style="color: #3f7f55;">{{ t.ndaNote }}</div>
                    </div>
                  </sc-if>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px 8px; margin-top: 14px; padding-left: 4ch;">
                  <sc-for list="{{ expActive.skills }}" as="sk" hint-placeholder-count="3"><span style="color: #4ade80; background: #0d1f14; padding: 0 8px;">+ {{ sk }}</span></sc-for>
                </div>
              </div>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.6 404
```html
<!-- 404 -->
      <sc-if value="{{ is404 }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="404" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px; max-width: 860px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~$</span>
              <span style="color: #e8e8e5;">cd {{ missingPath }}</span>
            </div>
            <div style="font-size: 13px; line-height: 20px; color: #f87171;">zsh: no such file or directory: {{ missingPath }}</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.15s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.21s steps(7, end) 0.23s both;">echo $?</span>
            </div>
            <div aria-label="404" style="display: grid; align-self: flex-start; font-family: Menlo, Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace; font-size: 16px; line-height: 1.15; user-select: none; animation: appear 0.12s ease-out 0.52s both;">
              <div style="grid-area: 1 / 1; color: #4ade80;"><sc-for list="{{ art404Fill }}" as="ln" hint-placeholder-count="6"><div style="white-space: pre;">{{ ln }}</div></sc-for></div>
              <div style="grid-area: 1 / 1; color: #2d6142;"><sc-for list="{{ art404Shade }}" as="ln" hint-placeholder-count="6"><div style="white-space: pre;">{{ ln }}</div></sc-for></div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px; animation: appear 0.12s ease-out 0.72s both;">
            <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 60ch; text-wrap: pretty;">{{ t.notFound }}</p>
            <div style="display: flex; flex-direction: column; max-width: 540px;">
              <button onClick="{{ goHome }}" style="display: grid; grid-template-columns: 2ch 14ch minmax(0, 1fr); align-items: center; column-gap: 10px; width: 100%; margin: 0; padding: 6px 10px; border: none; border-radius: 0; outline: none; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 18px; cursor: pointer; background: #4ade80; color: #050505;">
                <span>&gt;</span>
                <span>cd ~/home</span>
                <span style="color: #0f3d22;">{{ t.backHome }}</span>
              </button>
            </div>
          </div>
        </div>
      </sc-if>
```

### 8.7 Contact
```html
<!-- CONTACT -->
      <sc-if value="{{ isContact }}" hint-placeholder-val="{{ false }}">
        <div data-screen-label="Contact" style="font-family: 'JetBrains Mono', monospace; display: flex; flex-direction: column; gap: 24px; max-width: 860px;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/contact$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.39s steps(13, end) 0.08s both;">cat README.md</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; animation: appear 0.12s ease-out 0.55s both;">
              <h1 style="font-size: clamp(22px, 2.8vw, 28px); font-weight: 600; line-height: 1.3; letter-spacing: -0.02em; color: #e8e8e5; margin: 0; max-width: 42ch; text-wrap: balance;"><span style="color: #3f7f55;">#&nbsp;</span>{{ t.contactHeadline }}</h1>
              <p style="font-size: 13px; line-height: 1.75; color: #8a8a84; margin: 0; max-width: 78ch; text-wrap: pretty;">{{ t.contactSub }}</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; line-height: 18px; color: #565650; animation: appear 0.01s linear 0.72s both;">
              <span><span style="color: #4ade80;">tiago@estetele</span>:~/contact$</span>
              <span style="display: inline-block; color: #e8e8e5; animation: typeIn 0.36s steps(12, end) 0.8s both;">./contact.sh</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; animation: appear 0.12s ease-out 1.24s both;">
              <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; font-size: 13px; line-height: 20px;">
                <span style="color: #4ade80; font-weight: 600;">?</span>
                <span style="color: #e8e8e5; font-weight: 500;">{{ t.contactAsk }}</span>
                <span style="color: #6b6b65; font-size: 12px;">{{ t.contactAskHint }}</span>
              </div>
              <div style="display: flex; flex-direction: column; max-width: 540px;">
                <sc-for list="{{ contactRows }}" as="c" hint-placeholder-count="3">
                  <a href="{{ c.href }}" target="{{ c.target }}" rel="noopener" onMouseEnter="{{ c.select }}" onFocus="{{ c.select }}" style="display: grid; grid-template-columns: 2ch 10ch minmax(0, 1fr); align-items: center; column-gap: 10px; padding: 6px 10px; outline: none; text-decoration: none; font-size: 13px; line-height: 18px; background: {{ c.bg }}; color: {{ c.fg }}; transition: background 0.06s linear, color 0.06s linear;">
                    <span style="color: {{ c.ptr }};">&gt;</span>
                    <span>{{ c.key }}</span>
                    <span style="color: {{ c.sub }}; min-width: 0; overflow-wrap: anywhere;">{{ c.value }}</span>
                  </a>
                </sc-for>
              </div>
            </div>
          </div>
        </div>
      </sc-if>
    </div>
    </sc-if>
```


## 9. Template: barra do prompt (referência, inalterada)
```html
<!-- prompt / command line -->
    <div style="border-top: 1px solid #141414; background: #090909; padding: 12px 18px; flex-shrink: 0;">
      <sc-if value="{{ hasOutput }}" hint-placeholder-val="{{ false }}">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: {{ outputColor }}; margin-bottom: 8px; white-space: pre-wrap; line-height: 1.7;">{{ output }}</div>
      </sc-if>
      <div style="display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
        <span style="color: #4ade80;">tiago@estetele</span>
        <span style="color: #565650;">~/{{ page }}</span>
        <span style="color: #565650;">$</span>
        <span style="color: #e8e8e5; white-space: pre;">{{ typed }}</span>
        <span key="{{ cursorKey }}" style="display: inline-block; width: 8px; height: 15px; background: #4ade80; animation: blink 1.05s step-end infinite; flex-shrink: 0;"></span>
      </div>
    </div>
```


## 10. Lógica completa (classe `Component`)
Trechos novos ou alterados: `state` (homeSel, projSel, projVisited, projLoaded, expSel, contactSel, cmdHistory, historyIdx, bootTyping, bootTypedCmd, helpOpen), `BOOT_LINES_*`, `TE_ART`/`ART_404` (+ FILL/SHADE), `componentDidMount` (boot, cursor, canvas, `_lastPage`), `componentDidUpdate`, `componentWillUnmount`, `_handleKey` (histórico), `_rowStyle`, `_selProj`, `_projLoad`, `_homeRow`, `_navigate` (chama `_bgCommit`), `_execute` (novos comandos), `_setupCursor`, `_updateCursor`, `_setupCanvas` (grafo git) e, dentro de `renderVals`, as chaves novas de I18N, `EXP_DATA`/`EXP_TEXT`, `EDU_TREE`, a timeline, `CONTACTS` e todos os valores retornados novos.
```js
class Component extends DCLogic {
  state = {
    now: new Date(),
    booted: Date.now(),
    lang: (localStorage.getItem("te-portfolio-lang") || "en"),
    page: "home",
    typed: "",
    animating: false,
    contentIn: true,
    output: "",
    outputColor: "#6b6b65",
    windowIn: false,
    booting: true,
    bootStep: 0,
    bootTyping: false,
    bootTypedCmd: "",
    helpOpen: false,
    homeSel: 0,
    projSel: 0,
    projVisited: { 0: true },
    projLoaded: {},
    expSel: 0,
    contactSel: 0,
    cmdHistory: [],
    historyIdx: -1,
    missingPath: "~/void"
  };

  BOOT_LINES_CINEMATIC = [
    { tag: "[ OK ]", text: "boot sequence initialized", color: "#9a9a94" },
    { tag: "[ OK ]", text: "mounting /dev/portfolio", color: "#9a9a94" },
    { tag: "[ OK ]", text: "loading modules: react · next · typescript", color: "#9a9a94" },
    { tag: "[ OK ]", text: "connecting to tiagoestetele.dev ... 200", color: "#9a9a94" },
    { tag: "[ OK ]", text: "env: remote · brazil · utc-3", color: "#9a9a94" }
  ];

  BOOT_LINES_VERBOSE = [
    { tag: "[ OK ]", text: "boot sequence initialized", color: "#9a9a94" },
    { tag: "[ OK ]", text: "checking filesystem integrity ... clean", color: "#9a9a94" },
    { tag: "[ OK ]", text: "mounting /dev/portfolio", color: "#9a9a94" },
    { tag: "[ OK ]", text: "loading modules: react · next · typescript", color: "#9a9a94" },
    { tag: "[ OK ]", text: "loading modules: node · postgres · docker", color: "#9a9a94" },
    { tag: "[ OK ]", text: "resolving dependencies ... 412 packages", color: "#9a9a94" },
    { tag: "[ OK ]", text: "connecting to tiagoestetele.dev ... 200", color: "#9a9a94" },
    { tag: "[ OK ]", text: "env: remote · brazil · utc-3", color: "#9a9a94" },
    { tag: "[ OK ]", text: "spinning up render thread", color: "#9a9a94" }
  ];

  TE_ART = [
    "████████╗███████╗",
    "╚══██╔══╝██╔════╝",
    "   ██║   █████╗  ",
    "   ██║   ██╔══╝  ",
    "   ██║   ███████╗",
    "   ╚═╝   ╚══════╝"
  ];
  ART_FILL = this.TE_ART.map((l) => l.replace(/[^█]/g, " "));
  ART_SHADE = this.TE_ART.map((l) => l.replace(/█/g, " "));

  ART_404 = [
    "██╗  ██╗ ██████╗ ██╗  ██╗",
    "██║  ██║██╔═████╗██║  ██║",
    "███████║██║██╔██║███████║",
    "╚════██║████╔╝██║╚════██║",
    "     ██║╚██████╔╝     ██║",
    "     ╚═╝ ╚═════╝      ╚═╝"
  ];
  ART404_FILL = this.ART_404.map((l) => l.replace(/[^█]/g, " "));
  ART404_SHADE = this.ART_404.map((l) => l.replace(/█/g, " "));

  BOOT_CMD = "./portfolio --start";

  get BOOT_LINES() {
    return (this.props.bootMode ?? "cinematic") === "verbose" ? this.BOOT_LINES_VERBOSE : this.BOOT_LINES_CINEMATIC;
  }

  constructor(props) {
    super(props);
    this.bgRef = React.createRef();
    this.cursorDotRef = React.createRef();
    this.cursorRingRef = React.createRef();
    this.PAGES = ["home", "about", "stack", "projects", "experience", "contact"];
    this._mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, rx: -9999, ry: -9999, seen: false, hover: false };
  }

  componentDidMount() {
    this._lastPage = this.state.page;
    this._t = setInterval(() => this.setState({ now: new Date() }), 1000);
    this._onKey = (e) => this._handleKey(e);
    window.addEventListener("keydown", this._onKey);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      this._setupCanvas();
      this._setupCursor();
    }
    const bootMode = this.props.bootMode ?? "cinematic";
    if (reduced || bootMode === "instant") {
      this.setState({ windowIn: true, booting: false, bootStep: this.BOOT_LINES.length, bootTypedCmd: this.BOOT_CMD });
      return;
    }
    // window open animation, then boot log
    requestAnimationFrame(() => requestAnimationFrame(() => this.setState({ windowIn: true })));
    const speed = bootMode === "verbose" ? 0.55 : 1;
    let step = 0;
    const nextLine = () => {
      step++;
      this.setState({ bootStep: step });
      if (step < this.BOOT_LINES.length) {
        this._bootT = setTimeout(nextLine, (170 + Math.random() * 200) * speed);
      } else {
        this._bootT = setTimeout(() => {
          this.setState({ bootTyping: true });
          let i = 0;
          this._bootTyper = setInterval(() => {
            i++;
            this.setState({ bootTypedCmd: this.BOOT_CMD.slice(0, i) });
            if (i >= this.BOOT_CMD.length) {
              clearInterval(this._bootTyper);
              this._bootT = setTimeout(() => {
                this.setState({ booting: false, contentIn: false });
                setTimeout(() => this.setState({ contentIn: true }), 60);
              }, 380 * speed);
            }
          }, 38 * speed);
        }, 380 * speed);
      }
    };
    this._bootT = setTimeout(nextLine, 650 * speed);
  }

  componentWillUnmount() {
    clearInterval(this._t);
    clearInterval(this._typer);
    clearTimeout(this._bootT);
    clearInterval(this._bootTyper);
    clearTimeout(this._projT);
    clearTimeout(this._projFb);
    window.removeEventListener("pointerdown", this._onDown);
    cancelAnimationFrame(this._raf);
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("mousemove", this._onMove);
    window.removeEventListener("mouseout", this._onOut);
    document.body.style.cursor = "";
  }

  _handleKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.state.animating) return;
    this.setState({ lastKeyAt: Date.now() });
    if (e.key === "Enter") {
      const raw = this.state.typed.trim();
      if (raw) this.setState((s) => ({ cmdHistory: [...s.cmdHistory, raw], historyIdx: -1 }));
      this._execute(raw);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.setState((s) => {
        if (!s.cmdHistory.length) return null;
        const idx = s.historyIdx === -1 ? s.cmdHistory.length - 1 : Math.max(0, s.historyIdx - 1);
        return { historyIdx: idx, typed: s.cmdHistory[idx] };
      });
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.setState((s) => {
        if (s.historyIdx === -1) return null;
        const idx = s.historyIdx + 1;
        if (idx >= s.cmdHistory.length) return { historyIdx: -1, typed: "" };
        return { historyIdx: idx, typed: s.cmdHistory[idx] };
      });
      return;
    }
    if (e.key === "Backspace") {
      this.setState((s) => ({ typed: s.typed.slice(0, -1) }));
      e.preventDefault();
      return;
    }
    if (e.key.length === 1) {
      this.setState((s) => ({ typed: s.typed + e.key }));
      e.preventDefault();
    }
  }

  _rowStyle(sel) {
    return sel
      ? { bg: "#4ade80", fg: "#050505", ptr: "#050505", sub: "#0f3d22" }
      : { bg: "transparent", fg: "#c9c9c3", ptr: "transparent", sub: "#6b6b65" };
  }

  _selProj(i) {
    if (this.state.projSel !== i) this.setState({ projSel: i });
    clearTimeout(this._projT);
    this._projT = setTimeout(() => {
      if (!this.state.projVisited[i]) this.setState((s) => ({ projVisited: { ...s.projVisited, [i]: true } }));
      clearTimeout(this._projFb);
      this._projFb = setTimeout(() => this._projLoad(i), 10000);
    }, 160);
  }

  _projLoad(i) {
    if (!this.state.projLoaded[i]) this.setState((s) => ({ projLoaded: { ...s.projLoaded, [i]: true } }));
  }

  componentDidUpdate() {
    const p = this.state.page;
    if (p === this._lastPage) return;
    const prev = this._lastPage;
    this._lastPage = p;
    if (prev === "projects") this.setState((s) => ({ projVisited: { [s.projSel]: true }, projLoaded: {} }));
    if (p === "projects") {
      clearTimeout(this._projFb);
      const i = this.state.projSel;
      this._projFb = setTimeout(() => this._projLoad(i), 10000);
    }
  }

  _homeRow(i) {
    return (this.state.homeSel || 0) === i
      ? { bg: "#4ade80", fg: "#050505", ptr: "#050505", sub: "#0f3d22" }
      : { bg: "transparent", fg: "#c9c9c3", ptr: "transparent", sub: "#6b6b65" };
  }

  _navigate(page) {
    if (this.state.animating || page === this.state.page) return;
    const cmd = "cd ~/" + page;
    if (this._bgCommit) this._bgCommit(cmd);
    this.setState({ animating: true, typed: "", output: "" });
    let i = 0;
    clearInterval(this._typer);
    this._typer = setInterval(() => {
      i++;
      this.setState({ typed: cmd.slice(0, i) });
      if (i >= cmd.length) {
        clearInterval(this._typer);
        setTimeout(() => {
          this.setState({ contentIn: false });
          setTimeout(() => {
            this.setState({ page, typed: "", animating: false, contentIn: true });
          }, 240);
        }, 220);
      }
    }, 42);
  }

  _execute(raw) {
    if (!raw) return;
    const lang = this.state.lang;
    const parts = raw.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = (parts[1] || "").replace("~/", "").replace(/^\//, "");
    const say = (output, outputColor) => this.setState({ typed: "", output, outputColor: outputColor || "#6b6b65" });

    if (cmd === "cd") {
      const target = arg === "" || arg === "~" ? "home" : arg;
      if (this.PAGES.includes(target)) {
        if (this._bgCommit) this._bgCommit("cd ~/" + target);
        this.setState({ typed: "", output: "", contentIn: false });
        setTimeout(() => this.setState({ page: target, contentIn: true }), 240);
      } else {
        // unknown route → 404 page inside the terminal
        this.setState({ typed: "", output: "", missingPath: "~/" + (arg || "?"), contentIn: false });
        setTimeout(() => this.setState({ page: "404", contentIn: true }), 240);
      }
    } else if (cmd === "ls") {
      say(this.PAGES.map((p) => p + "/").join("  "), "#9a9a94");
    } else if (cmd === "help") {
      say(lang === "br"
        ? "comandos: cd <página> · ls · pwd · history · echo · man · whoami · lang en|br · clear\npáginas: " + this.PAGES.join(", ")
        : "commands: cd <page> · ls · pwd · history · echo · man · whoami · lang en|br · clear\npages: " + this.PAGES.join(", "), "#9a9a94");
    } else if (cmd === "whoami") {
      say("Tiago Estetele — " + (lang === "br" ? "desenvolvedor web · especialista em front-end" : "web developer · front-end specialist"), "#9a9a94");
    } else if (cmd === "lang") {
      if (arg === "en" || arg === "br") {
        localStorage.setItem("te-portfolio-lang", arg);
        this.setState({ lang: arg, typed: "", output: "" });
      } else {
        say("usage: lang en|br", "#f87171");
      }
    } else if (cmd === "clear") {
      this.setState({ typed: "", output: "" });
    } else if (cmd === "pwd") {
      say("/home/tiago/" + page, "#9a9a94");
    } else if (cmd === "date") {
      say(new Date().toString(), "#9a9a94");
    } else if (cmd === "history") {
      say(this.state.cmdHistory.length ? this.state.cmdHistory.join("\n") : (lang === "br" ? "sem histórico ainda" : "no history yet"), "#9a9a94");
    } else if (cmd === "echo") {
      say(parts.slice(1).join(" "), "#9a9a94");
    } else if (cmd === "man") {
      this.setState({ typed: "", output: "", helpOpen: true });
    } else if (cmd === "sudo") {
      say(lang === "br" ? "nice try. 😏 permissão negada." : "nice try. 😏 permission denied.", "#f87171");
    } else {
      say("zsh: command not found: " + cmd + (lang === "br" ? " — digite 'help'" : " — type 'help'"), "#f87171");
    }
  }

  _setupCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if ((this.props.cursorStyle ?? "ring") === "system") {
      document.body.style.cursor = "auto";
      return;
    }
    const m = this._mouse;
    this._onMove = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      if (!m.seen) { m.sx = m.rx = m.x; m.sy = m.ry = m.y; m.seen = true; }
      const el = e.target && e.target.closest ? e.target.closest("button, a") : null;
      if (!!el !== m.hover) {
        m.hover = !!el;
        const ring = this.cursorRingRef.current;
        const block = (this.props.cursorStyle ?? "ring") === "block";
        if (ring) {
          const big = m.hover ? "48px" : (block ? "22px" : "34px");
          ring.style.width = big;
          ring.style.height = big;
          ring.style.margin = m.hover ? "-24px 0 0 -24px" : (block ? "-11px 0 0 -11px" : "-17px 0 0 -17px");
          ring.style.borderColor = m.hover ? "rgba(134,239,172,0.9)" : "rgba(74,222,128,0.55)";
          ring.style.background = m.hover ? "rgba(74,222,128,0.08)" : "transparent";
        }
      }
    };
    this._onOut = (e) => {
      if (e.relatedTarget) return;
      m.seen = false;
      const dot = this.cursorDotRef.current, ring = this.cursorRingRef.current;
      if (dot) dot.style.opacity = "0";
      if (ring) ring.style.opacity = "0";
    };
    window.addEventListener("mousemove", this._onMove);
    window.addEventListener("mouseout", this._onOut);
  }

  _updateCursor() {
    if ((this.props.cursorStyle ?? "ring") === "system") return;
    const m = this._mouse;
    if (!m.seen) return;
    const block = (this.props.cursorStyle ?? "ring") === "block";
    // dot follows tightly, ring trails softly (block mode: both move together, snappier)
    m.sx += (m.x - m.sx) * (block ? 0.5 : 0.35);
    m.sy += (m.y - m.sy) * (block ? 0.5 : 0.35);
    m.rx += (m.x - m.rx) * (block ? 0.3 : 0.14);
    m.ry += (m.y - m.ry) * (block ? 0.3 : 0.14);
    const dot = this.cursorDotRef.current, ring = this.cursorRingRef.current;
    if (dot) {
      dot.style.opacity = "1";
      dot.style.transform = "translate3d(" + m.sx.toFixed(1) + "px," + m.sy.toFixed(1) + "px,0)";
    }
    if (ring) {
      ring.style.opacity = "1";
      ring.style.borderRadius = block ? "3px" : "50%";
      ring.style.transform = "translate3d(" + m.rx.toFixed(1) + "px," + m.ry.toFixed(1) + "px,0)";
    }
  }

  _setupCanvas() {
    const canvas = this.bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const LANE = 64, DX = 44;
    const MSGS = [
      "feat: neofetch on ~/home", "fix(cursor): smoother lerp", "feat: tig-style experience view",
      "perf: cache live previews", "chore: bump dependencies", "refactor: extract prompt helper",
      "feat(i18n): pt-br strings", "fix: 404 exit code", "style: tabular nums on clock",
      "docs: update README", "test: boot sequence", "feat(projects): live iframe preview",
      "fix: safari clip-path", "build: ship standalone html", "feat: help panel",
      "style: square corners everywhere", "perf: throttle canvas to 30fps", "fix(nav): wait for boot",
      "feat: tree ./education", "refactor: split i18n tables", "fix: focus ring on rows"
    ];
    const BRANCHES = ["feat/neofetch", "fix/cursor", "feat/tig-view", "chore/deps", "feat/live-preview", "style/sharp-ui", "feat/i18n", "perf/canvas"];
    const HEX = "0123456789abcdef";
    let seed = 20220901;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const sha = () => { let s = ""; for (let i = 0; i < 7; i++) s += HEX[Math.floor(rnd() * 16)]; return s; };
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    let W = 0, H = 0, lanes = 0, active = [], cols = [], nextCol = 0, offset = 0;
    const visits = [];
    const ly = (k) => Math.round(LANE / 2 + k * LANE) + 0.5;

    const genCol = () => {
      const x = nextCol * DX;
      nextCol++;
      const segs = [], nodes = [];
      const next = active.slice();
      let n = 0;
      for (let k = 0; k < lanes; k++) if (active[k]) n++;
      const target = Math.max(2, Math.round(lanes * 0.42));
      const pFork = n < target ? 0.09 : 0.025;
      const pMerge = n > target ? 0.09 : 0.025;
      const busy = new Uint8Array(lanes);
      for (let k = 0; k < lanes; k++) {
        if (!active[k]) continue;
        const nb = k + (rnd() < 0.5 ? -1 : 1);
        if (nb >= 0 && nb < lanes && active[nb] && !busy[k] && !busy[nb] && n > 2 && rnd() < pMerge) {
          segs.push({ c: 1, x0: x, y0: ly(k), x1: x + DX, y1: ly(nb) });
          nodes.push({ x: x + DX, y: ly(nb), sha: sha(), msg: "Merge branch '" + pick(BRANCHES) + "'", merge: 1 });
          next[k] = 0; busy[k] = 1; busy[nb] = 1; n--;
          continue;
        }
        segs.push({ c: 0, x0: x, y0: ly(k), x1: x + DX, y1: ly(k) });
        if (rnd() < 0.3) nodes.push({ x: x, y: ly(k), sha: sha(), msg: pick(MSGS) });
        const fn = k + (rnd() < 0.5 ? -1 : 1);
        if (fn >= 0 && fn < lanes && !active[fn] && !next[fn] && !busy[k] && rnd() < pFork) {
          segs.push({ c: 1, x0: x, y0: ly(k), x1: x + DX, y1: ly(fn) });
          next[fn] = 1; busy[fn] = 1; n++;
        }
      }
      if (n === 0) next[Math.floor(rnd() * lanes)] = 1;
      active = next;
      cols.push({ x: x, segs: segs, nodes: nodes });
    };

    const reset = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lanes = Math.ceil(H / LANE) + 1;
      active = [];
      for (let k = 0; k < lanes; k++) active.push(rnd() < 0.42 ? 1 : 0);
      cols = [];
      nextCol = Math.floor(offset / DX) - 2;
      while (nextCol * DX < offset + W + DX * 2) genCol();
    };
    this._onResize = reset;
    window.addEventListener("resize", reset);
    reset();

    const addVisit = (sx, k, text) => {
      visits.push({ x: sx + offset, y: ly(Math.max(0, Math.min(lanes - 1, k))), t0: performance.now(), sha: sha(), msg: text });
      if (visits.length > 12) visits.shift();
    };
    // clicks in the margins commit to the graph
    this._onDown = (e) => addVisit(e.clientX, Math.round((e.clientY - LANE / 2) / LANE), "feat: visitor was here");
    window.addEventListener("pointerdown", this._onDown);
    // every navigation becomes a commit at the right edge, then scrolls into history
    this._bgCommit = (text) => {
      const live = [];
      for (let k = 1; k < lanes - 1; k++) if (active[k]) live.push(k);
      const k = live.length ? live[Math.floor(Math.random() * live.length)] : Math.floor(lanes / 2);
      addVisit(W - Math.max(48, (W - 980) / 4), k, text);
    };

    const label = (sx, y, a, b, alpha) => {
      ctx.font = "10px 'JetBrains Mono', monospace";
      const gap = ctx.measureText(a + "  ").width;
      const w = gap + ctx.measureText(b).width;
      let lx = sx + 10;
      if (lx + w + 8 > W) lx = sx - 10 - w;
      const by = y - 9;
      ctx.fillStyle = "rgba(5, 6, 5, " + (0.92 * alpha).toFixed(3) + ")";
      ctx.fillRect(lx - 5, by - 11, w + 10, 16);
      ctx.fillStyle = "rgba(74, 222, 128, " + alpha.toFixed(3) + ")";
      ctx.fillText(a, lx, by);
      ctx.fillStyle = "rgba(201, 201, 195, " + alpha.toFixed(3) + ")";
      ctx.fillText(b, lx + gap, by);
    };

    const m = this._mouse;
    let last = 0, prevT = 0, bump = 0;
    const loop = (t) => {
      this._raf = requestAnimationFrame(loop);
      this._updateCursor();
      const mode = this.props.backgroundMode ?? "graph";
      if (mode === "off") { ctx.clearRect(0, 0, W, H); prevT = t; return; }
      if (t - last < 33) return;
      const dt = prevT ? Math.min(0.1, (t - prevT) / 1000) : 0;
      prevT = t; last = t;
      const quiet = mode === "quiet";
      offset += dt * (quiet ? 7 : 16);
      while (nextCol * DX < offset + W + DX * 2) genCol();
      while (cols.length && cols[0].x + DX * 3 < offset) cols.shift();
      for (let v = visits.length - 1; v >= 0; v--) if (visits[v].x - offset < -300) visits.splice(v, 1);
      bump += ((m.seen ? 1 : 0) - bump) * 0.08;
      const mx = m.rx, my = m.ry;

      const lines = new Path2D(), dots = new Path2D(), mdots = new Path2D();
      let best = null, bestD = 70 * 70;
      for (let ci = 0; ci < cols.length; ci++) {
        const col = cols[ci];
        for (let si = 0; si < col.segs.length; si++) {
          const s = col.segs[si];
          const x0 = s.x0 - offset, x1 = s.x1 - offset;
          lines.moveTo(x0, s.y0);
          if (s.c) lines.bezierCurveTo(x0 + DX * 0.55, s.y0, x1 - DX * 0.55, s.y1, x1, s.y1);
          else lines.lineTo(x1, s.y1);
        }
        for (let ni = 0; ni < col.nodes.length; ni++) {
          const nd = col.nodes[ni];
          const sx = Math.round(nd.x - offset) + 0.5;
          if (sx < -10 || sx > W + 10) continue;
          if (nd.merge) mdots.rect(sx - 3, nd.y - 3, 6, 6);
          else dots.rect(sx - 3, nd.y - 3, 6, 6);
          if (bump > 0.05) {
            const dx = sx - mx, dy = nd.y - my, d2 = dx * dx + dy * dy;
            if (d2 < bestD) { bestD = d2; best = { sx: sx, y: nd.y, sha: nd.sha, msg: nd.msg }; }
          }
        }
      }

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      const baseA = quiet ? 0.07 : 0.12;
      const nodeA = (baseA * 1.8).toFixed(3);
      ctx.strokeStyle = "rgba(74, 222, 128, " + baseA + ")";
      ctx.stroke(lines);
      ctx.fillStyle = "#060806";
      ctx.fill(dots);
      ctx.strokeStyle = "rgba(74, 222, 128, " + nodeA + ")";
      ctx.stroke(dots);
      ctx.fillStyle = "rgba(74, 222, 128, " + nodeA + ")";
      ctx.fill(mdots);
      if (bump > 0.02) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, quiet ? 200 : 260);
        g.addColorStop(0, "rgba(134, 239, 172, " + (0.6 * bump * (quiet ? 0.5 : 1)).toFixed(3) + ")");
        g.addColorStop(1, "rgba(134, 239, 172, 0)");
        ctx.strokeStyle = g;
        ctx.stroke(lines);
        ctx.stroke(dots);
        ctx.fillStyle = g;
        ctx.fill(mdots);
      }

      // session commits (navigation + clicks)
      const now = performance.now();
      for (let v = 0; v < visits.length; v++) {
        const vi = visits[v];
        const sx = Math.round(vi.x - offset) + 0.5;
        const age = (now - vi.t0) / 1000;
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(sx - 4, vi.y - 4, 8, 8);
        if (age < 1.2) {
          const s = 8 + age * 70;
          ctx.strokeStyle = "rgba(134, 239, 172, " + (0.8 * (1 - age / 1.2)).toFixed(3) + ")";
          ctx.strokeRect(sx - s / 2, vi.y - s / 2, s, s);
        }
        if (age < 4.5) label(sx, vi.y, vi.sha, vi.msg, Math.min(1, (4.5 - age) / 0.8));
        if (bump > 0.05) {
          const dx = sx - mx, dy = vi.y - my, d2 = dx * dx + dy * dy;
          if (d2 < bestD) { bestD = d2; best = { sx: sx, y: vi.y, sha: vi.sha, msg: vi.msg }; }
        }
      }

      if (best) {
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(best.sx - 3.5, best.y - 3.5, 7, 7);
        label(best.sx, best.y, best.sha, best.msg, Math.min(1, bump));
      }
    };
    this._raf = requestAnimationFrame(loop);
  }

  renderVals() {
    const pad = (n) => String(n).padStart(2, "0");
    const d = this.state.now;
    const clock = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    const secs = Math.floor((Date.now() - this.state.booted) / 1000);
    const uptime = pad(Math.floor(secs / 3600)) + ":" + pad(Math.floor((secs % 3600) / 60)) + ":" + pad(secs % 60);
    const lang = this.state.lang;
    const page = this.state.page;

    const I18N = {
      en: {
        role: "web developer · front-end specialist · brazil",
        headline1: "Building scalable web experiences and exploring the future of",
        headlineAI: "AI",
        heroSub: "Web developer specialized in front-end, with hands-on full stack experience — and ambitious about where AI is taking software engineering.",
        ctaContact: "Get in Touch",
        ctaStack: "Explore My Stack",
        hint: "tip: navigate with the tabs above — or type commands. try 'help'.",
        footerHint: "type 'help' for commands",
        about1: "I'm a web developer, specialized in front-end, who cares about the details — clean architecture, fast interfaces, and code that other people enjoy maintaining. Since 2022 I've been working remotely from Brazil, shipping products with React, Next.js and headless CMS stacks.",
        about2: "Right now I'm going deeper: software architecture, back-end development, and AI engineering. I believe the best interfaces of the next decade will be built by people who understand the whole system.",
        stackPill: "My Stack",
        stackSub: "Carefully chosen technologies for modern, scalable, and performant web applications.",
        projectsPill: "Featured Projects",
        contactPill: "Contact",
        contactHeadline: "Let's build something great together.",
        contactSub: "Open to freelance, full-time, and collaboration opportunities.",
        notFound: "This directory doesn't exist, was moved, or never compiled. Let's get you back to safety.",
        nfRole: "Web Developer · Front-End Specialist",
        nfWork: "Full Stack Developer (Mid-level) @ Brivia",
        nfLocation: "Brazil · remote · UTC-3",
        nfStatus: "open to opportunities",
        homeAsk: "Where to next?",
        homeAskHint: "(click an option or type the command)",
        ndaErr: "error: insufficient clearance — this commit is under NDA",
        ndaWip: "work in progress",
        ndaNote: "# details get declassified once it ships",
        aboutTitle: "About me",
        projectsSub: "A few of the websites I've worked on.",
        projHint: "hover a project to load it live",
        projLive: "live",
        projLoading: "loading",
        expHint: "click a commit to inspect",
        contactAsk: "How would you like to reach me?",
        contactAskHint: "(click to open)",
        openProfile: "open profile ↗",
        backHome: "back to the start",
        eduTitle: "ACADEMIC BACKGROUND",
        helpNavTitle: "NAVIGATION",
        helpNavBody: "Use the tabs at the top of the window to jump between pages — or navigate like a real terminal: click anywhere and type commands. Press Enter to run them.",
        helpCmdTitle: "COMMANDS",
        helpTip: "tip: 'cd' into a path that doesn't exist and see what happens."
      },
      br: {
        role: "desenvolvedor web · especialista em front-end · brasil",
        headline1: "Construindo experiências web escaláveis e explorando o futuro da",
        headlineAI: "IA",
        heroSub: "Desenvolvedor web especializado em front-end, com experiência prática em full stack — e ambicioso com o rumo que a IA está dando à engenharia de software.",
        ctaContact: "Fale Comigo",
        ctaStack: "Conheça Minha Stack",
        hint: "dica: navegue pelas abas acima — ou digite comandos. tente 'help'.",
        footerHint: "digite 'help' para ver os comandos",
        about1: "Sou um desenvolvedor web, especializado em front-end, que se importa com os detalhes — arquitetura limpa, interfaces rápidas e código que outras pessoas gostam de manter. Desde 2022 trabalho remotamente do Brasil, entregando produtos com React, Next.js e CMS headless.",
        about2: "Agora estou indo mais fundo: arquitetura de software, back-end e engenharia de IA. Acredito que as melhores interfaces da próxima década serão construídas por quem entende o sistema inteiro.",
        stackPill: "Minha Stack",
        stackSub: "Tecnologias escolhidas a dedo para aplicações web modernas, escaláveis e performáticas.",
        projectsPill: "Projetos em Destaque",
        contactPill: "Contato",
        contactHeadline: "Vamos construir algo grande juntos.",
        contactSub: "Aberto a freelas, oportunidades full-time e colaborações.",
        notFound: "Esse diretório não existe, foi movido ou nunca compilou. Vamos voltar para um lugar seguro.",
        nfRole: "Desenvolvedor Web · Especialista em Front-End",
        nfWork: "Desenvolvedor Full Stack (Pleno) @ Brivia",
        nfLocation: "Brasil · remoto · UTC-3",
        nfStatus: "aberto a oportunidades",
        homeAsk: "Para onde agora?",
        homeAskHint: "(clique numa opção ou digite o comando)",
        ndaErr: "erro: acesso restrito — este commit está sob NDA",
        ndaWip: "em andamento",
        ndaNote: "# os detalhes serão liberados quando o projeto for público",
        aboutTitle: "Sobre mim",
        projectsSub: "Alguns dos sites em que trabalhei.",
        projHint: "passe o mouse num projeto para carregá-lo ao vivo",
        projLive: "ao vivo",
        projLoading: "carregando",
        expHint: "clique num commit para ver",
        contactAsk: "Como prefere falar comigo?",
        contactAskHint: "(clique para abrir)",
        openProfile: "abrir perfil ↗",
        backHome: "voltar ao início",
        eduTitle: "FORMAÇÃO ACADÊMICA",
        helpNavTitle: "NAVEGAÇÃO",
        helpNavBody: "Use as abas no topo da janela para trocar de página — ou navegue como num terminal de verdade: clique em qualquer lugar e digite comandos. Aperte Enter para executar.",
        helpCmdTitle: "COMANDOS",
        helpTip: "dica: dê 'cd' num caminho que não existe e veja o que acontece."
      }
    };

    const STACK_SUBS = {
      en: ["UI & Experience", "APIs & Services", "Content Management", "Data & Storage", "Workflow & Delivery", "The future of engineering"],
      br: ["UI & Experiência", "APIs & Serviços", "Gestão de Conteúdo", "Dados & Armazenamento", "Workflow & Entrega", "O futuro da engenharia"]
    };
    const PROJ_DESCS = {
      en: [
        "Corporate website focused on digital presence and institutional communication.",
        "Agribusiness platform focused on customer engagement and loyalty programs.",
        "Creative agency website with modern design and interactive user experience.",
        "Corporate website focused on information security solutions.",
        "Website blog with articles and questions for students."
      ],
      br: [
        "Site corporativo focado em presença digital e comunicação institucional.",
        "Plataforma de agronegócio focada em engajamento e programas de fidelidade.",
        "Site de agência criativa com design moderno e experiência interativa.",
        "Site corporativo focado em soluções de segurança da informação.",
        "Blog com artigos e questões para estudantes."
      ]
    };
    const EXP_DATA = [
      { sha: "a3f9c21", deco: "HEAD -> brivia", start: [2026, 9], end: null, skills: ["PHP", "JavaScript", "HTML", "CSS/SCSS", "WordPress", "SEO"] },
      { sha: "7b21e04", deco: "", start: [2025, 12], end: [2026, 9], skills: ["PHP", "JavaScript", "HTML", "CSS/SCSS", "WordPress", "SEO"] },
      { sha: "4c8d1aa", deco: "polo-bpm", start: [2025, 6], end: [2025, 11], skills: ["React.js", "Tailwind CSS", "Node.js", "Express"] },
      { sha: "9e02f7b", deco: "okn", start: [2024, 1], end: [2025, 6], skills: ["JavaScript", "React.js", "Next.js", "PHP"] },
      { sha: "1d4c3e9", deco: "", start: [2022, 9], end: [2024, 1], skills: ["JavaScript", "PHP", "WordPress", "Elementor", "SASS/SCSS", "Figma"] }
    ];
    const EXP_TEXT = {
      en: [
        { role: "Full Stack Developer (Mid-level)", org: "Brivia | The Creative Smartech · 11 mos", period: "Sep 2026 — Present · 2 mos", where: "Full-time · Remote", desc: [], redacted: true },
        { role: "Front-End Developer", org: "Brivia | The Creative Smartech · 11 mos", period: "Dec 2025 — Sep 2026 · 10 mos", where: "Full-time · Remote", desc: [
          "As a Front-End Developer, I worked on projects for major companies such as Wilson Sons, Magazine Luiza (Magalu) and Azul Viagens, collaborating in multidisciplinary teams and contributing directly to the evolution, maintenance and improvement of their digital products.",
          "During this period I developed and evolved website solutions, built and shipped landing pages, developed e-mail marketing, maintained and improved existing components, and implemented new features and interface improvements.",
          "I also took an active part in maintaining and optimizing the applications — fixing bugs, adjusting responsiveness and ensuring delivery quality — aiming for a great user experience and keeping projects aligned with business needs.",
          "Beyond development, I analyzed and improved performance and SEO metrics, helping optimize the websites and their search-engine ranking. My work mainly involved PHP, JavaScript, HTML, CSS/SCSS and WordPress, plus tools and practices for interface development, e-mail marketing, performance optimization and SEO."
        ] },
        { role: "Full Stack Developer (Mid-level)", org: "Polo BPM", period: "Jun 2025 — Nov 2025 · 6 mos", where: "Ribeirão Preto, São Paulo, Brazil · Remote", desc: [
          "During my time at Polo Trial, I had the pleasure of developing and maintaining a Clinical Research Management platform, contributing mainly to the React front-end. I also collaborated on the Node.js (Express) back-end, helping integrate both layers of the application.",
          "It was an enriching experience where I sharpened my technical skills and actively took part in the evolution of a high-impact project. I'm grateful for everything I learned and for the partnerships built along this short but rewarding journey."
        ] },
        { role: "Front-End Developer", org: "OKN · 2 yrs 10 mos", period: "Jan 2024 — Jun 2025 · 1 yr 6 mos", where: "Full-time · Remote", desc: [
          "Throughout my time at OKN, I developed and maintained web systems, building interfaces and features mainly with React, Next.js, JavaScript and PHP."
        ] },
        { role: "Intern", org: "OKN · 2 yrs 10 mos", period: "Sep 2022 — Jan 2024 · 1 yr 5 mos", where: "Internship", desc: [
          "During my internship at OKN, I worked on developing and maintaining web systems, helping implement features and interfaces with PHP, WordPress, JavaScript and SASS/SCSS.",
          "I also maintained WordPress sites built with Elementor and developed interfaces from Figma layouts, gaining hands-on experience in front-end development, systems maintenance and web technologies."
        ] }
      ],
      br: [
        { role: "Desenvolvedor Full Stack (Pleno)", org: "Brivia | The Creative Smartech · 11 meses", period: "set. de 2026 — o momento · 2 meses", where: "Tempo integral · Remoto", desc: [], redacted: true },
        { role: "Desenvolvedor Front End", org: "Brivia | The Creative Smartech · 11 meses", period: "dez. de 2025 — set. de 2026 · 10 meses", where: "Tempo integral · Remoto", desc: [
          "Durante minha experiência como Desenvolvedor Front-end, tive a oportunidade de atuar em projetos para grandes empresas, como Wilson Sons, Magazine Luiza (Magalu) e Azul Viagens, trabalhando em equipes multidisciplinares e contribuindo diretamente para a evolução, manutenção e melhoria de seus produtos digitais.",
          "Nesse período, atuei no desenvolvimento e evolução de soluções para websites, criação e implementação de landing pages, desenvolvimento de e-mail marketing, manutenção e aprimoramento de componentes existentes, além da implementação de novas funcionalidades e melhorias de interface.",
          "Também participei ativamente da manutenção e otimização das aplicações, correção de bugs, ajustes de responsividade e garantia da qualidade das entregas, buscando proporcionar uma boa experiência ao usuário e manter os projetos alinhados às necessidades do negócio.",
          "Além do desenvolvimento, atuei na análise e melhoria de métricas de desempenho e SEO, contribuindo para a otimização dos websites e para a melhoria de sua performance e posicionamento nos mecanismos de busca. Minha atuação envolveu principalmente tecnologias como PHP, JavaScript, HTML, CSS/SCSS e WordPress, além de ferramentas e práticas voltadas ao desenvolvimento de interfaces, criação de e-mail marketing, otimização de performance e SEO."
        ] },
        { role: "Desenvolvedor Full Stack (Pleno)", org: "Polo BPM", period: "jun. de 2025 — nov. de 2025 · 6 meses", where: "Ribeirão Preto, São Paulo, Brasil · Remoto", desc: [
          "Durante meu período na Polo Trial, tive o prazer de atuar no desenvolvimento e manutenção de uma plataforma de Gestão de Pesquisa Clínica, contribuindo principalmente com o front-end em React. Também tive a oportunidade de colaborar no back-end com Node.js (Express), auxiliando na integração entre as duas camadas da aplicação.",
          "Foi uma experiência enriquecedora, onde pude aprimorar minhas habilidades técnicas e participar ativamente da evolução de um projeto de grande impacto. Fico muito grato por todo o aprendizado e pelas parcerias construídas ao longo dessa jornada curta, mas enriquecedora."
        ] },
        { role: "Desenvolvedor Front-end", org: "OKN · 2 anos 10 meses", period: "jan. de 2024 — jun. de 2025 · 1 ano 6 meses", where: "Tempo integral · Remoto", desc: [
          "Durante minha trajetória na OKN, atuei no desenvolvimento e manutenção de sistemas web, participando da criação de interfaces e funcionalidades utilizando principalmente React, Next.js, JavaScript e PHP."
        ] },
        { role: "Estagiário", org: "OKN · 2 anos 10 meses", period: "set. de 2022 — jan. de 2024 · 1 ano 5 meses", where: "Estágio", desc: [
          "Durante o período de estágio na OKN, atuei no desenvolvimento e manutenção de sistemas web, auxiliando na implementação de funcionalidades e interfaces utilizando PHP, WordPress, JavaScript e SASS/SCSS.",
          "Também trabalhei na manutenção de sites WordPress com Elementor e no desenvolvimento de interfaces a partir de layouts do Figma, adquirindo experiência prática com desenvolvimento front-end, manutenção de sistemas e tecnologias web."
        ] }
      ]
    };
    const PROJ_BASE = [
      { name: "OKN Group", domain: "okn.com.br", url: "https://okn.com.br" },
      { name: "Seedz", domain: "seedz.ag", url: "https://seedz.ag" },
      { name: "AND,ALL", domain: "andall.ag", url: "https://andall.ag" },
      { name: "Doc Security", domain: "dsec.com.br", url: "https://dsec.com.br" },
      { name: "Blog Professor Ferreto", domain: "blog.professorferretto.com.br", url: "https://blog.professorferretto.com.br/" }
    ];
    const STACK_BASE = [
      { dir: "frontend/", techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"] },
      { dir: "backend/", techs: ["Node.js", "REST APIs", "Express"] },
      { dir: "cms/", techs: ["WordPress", "Strapi"] },
      { dir: "database/", techs: ["PostgreSQL", "MySQL"] },
      { dir: "devops/", techs: ["Git", "GitHub", "Vercel", "Docker", "CI/CD"] },
      { dir: "ai/", techs: ["Claude", "Copilot", "Cursor", "Prompt Engineering"] }
    ];
    const TAB_LABELS = { home: "~/home", about: "about", stack: "stack", projects: "projects", experience: "experience", contact: "contact" };
    const EDU_TREE = (lang === "br"
      ? [
          { dir: "famef/", period: "2025-02 → 2025-08", course: "Pós-graduação Lato Sensu - MBA, Computer Software Engineering · FAMEF", tags: ["Ciclo de vida de software", "Engenharia de requisitos", "Arquitetura de software", "DevOps", "Cloud", "Qualidade de software", "Gestão ágil"] },
          { dir: "unip/", period: "2022-02 → 2024-01", course: "Curso Superior de Tecnologia (CST), Análise e Desenvolvimento de Sistemas · Universidade Paulista", tags: ["JavaScript", "React.js", "Node.js", "SQL", "POO"] }
        ]
      : [
          { dir: "famef/", period: "2025-02 → 2025-08", course: "Lato Sensu Postgraduate - MBA, Computer Software Engineering · FAMEF", tags: ["Software Lifecycle", "Requirements Engineering", "Software Architecture", "DevOps", "Cloud", "Software Quality", "Agile Management"] },
          { dir: "unip/", period: "2022-02 → 2024-01", course: "Associate Degree (CST), Systems Analysis and Development · Universidade Paulista", tags: ["JavaScript", "React.js", "Node.js", "SQL", "OOP"] }
        ]).map((e, i, arr) => {
          const lastE = i === arr.length - 1;
          return { ...e, tags: e.tags.join(" · "), p1: lastE ? "└── " : "├── ", p2: lastE ? "    ├── " : "│   ├── ", p3: lastE ? "    └── " : "│   └── " };
        });

    const ps = this.state.projSel || 0;
    const projActive = PROJ_BASE[ps];
    const projLive = !!this.state.projLoaded[ps];

    const es = this.state.expSel || 0;
    const nowD = new Date();
    const mi = (y, mo) => (y - 2022) * 12 + (mo - 1);
    const T0 = mi(2022, 9);
    const T1 = mi(nowD.getFullYear(), nowD.getMonth() + 1) + 1;
    const span = Math.max(1, T1 - T0);
    const pct = (v) => Math.max(0, Math.min(100, v)).toFixed(2) + "%";
    const expTicks = [];
    for (let y = 2023; y <= nowD.getFullYear(); y++) expTicks.push({ label: String(y), left: pct(((mi(y, 1) - T0) / span) * 100) });
    const expRows = EXP_DATA.map((e, i) => {
      const s = mi(e.start[0], e.start[1]);
      const en = e.end ? mi(e.end[0], e.end[1]) + 1 : T1;
      const sel = es === i;
      return {
        date: e.start[0] + "-" + String(e.start[1]).padStart(2, "0"),
        id: e.sha,
        decoText: e.deco ? "(" + e.deco + ") " : "",
        role: EXP_TEXT[lang][i].role,
        left: pct(((s - T0) / span) * 100),
        width: pct(Math.max(1.5, ((en - s) / span) * 100)),
        select: () => { if (this.state.expSel !== i) this.setState({ expSel: i }); },
        bg: sel ? "#4ade80" : "transparent",
        fg: sel ? "#050505" : "#c9c9c3",
        sub: sel ? "#0f3d22" : "#565650",
        idC: sel ? "#0f3d22" : "#8a8a84",
        deco: sel ? "#050505" : "#86efac",
        node: sel ? "#050505" : (i === 0 ? "#4ade80" : "#2d6142"),
        track: sel ? "rgba(5,5,5,0.14)" : "#121212",
        bar: sel ? "#050505" : "#2d6142"
      };
    });
    const ea = EXP_DATA[es], et = EXP_TEXT[lang][es];

    const cs = this.state.contactSel || 0;
    const CONTACTS = [
      { key: "email", value: "hello@tiagoestetele.dev", href: "mailto:hello@tiagoestetele.dev", target: "_self" },
      { key: "github", value: I18N[lang].openProfile, href: "https://github.com", target: "_blank" },
      { key: "linkedin", value: I18N[lang].openProfile, href: "https://linkedin.com", target: "_blank" }
    ];

    const setLang = (l) => {
      localStorage.setItem("te-portfolio-lang", l);
      this.setState({ lang: l });
    };

    return {
      clock,
      uptime,
      cursorKey: this.state.lastKeyAt || 0,
      bgRef: this.bgRef,
      cursorDotRef: this.cursorDotRef,
      cursorRingRef: this.cursorRingRef,
      page,
      typed: this.state.typed,
      output: this.state.output,
      hasOutput: !!this.state.output,
      outputColor: this.state.outputColor,
      contentOpacity: this.state.contentIn ? 1 : 0,
      contentShift: this.state.contentIn ? "0px" : "16px",
      windowOpacity: this.state.windowIn ? 1 : 0,
      windowScale: this.state.windowIn ? 1 : 0.94,
      windowShift: this.state.windowIn ? "0px" : "24px",
      booting: this.state.booting,
      notBooting: !this.state.booting,
      navOpacity: this.state.booting ? 0 : 1,
      navPointer: this.state.booting ? "none" : "auto",
      navShift: this.state.booting ? "-6px" : "0px",
      helpOpen: this.state.helpOpen,
      toggleHelp: () => this.setState((s) => ({ helpOpen: !s.helpOpen })),
      helpBtnBorder: this.state.helpOpen ? "#2e4a38" : "#232323",
      helpBtnBg: this.state.helpOpen ? "#0e1a12" : "rgba(12,12,12,0.9)",
      helpBtnColor: this.state.helpOpen ? "#4ade80" : "#8a8a84",
      helpCmds: lang === "br"
        ? [
            { cmd: "cd <página>", desc: "vai para uma página — ex: cd stack" },
            { cmd: "ls", desc: "lista todas as páginas disponíveis" },
            { cmd: "pwd", desc: "mostra o diretório atual" },
            { cmd: "history", desc: "mostra comandos já digitados (↑/↓ também navega)" },
            { cmd: "echo <texto>", desc: "repete o texto digitado" },
            { cmd: "man", desc: "abre este painel de ajuda" },
            { cmd: "whoami", desc: "quem é o Tiago" },
            { cmd: "lang en|br", desc: "troca o idioma" },
            { cmd: "clear", desc: "limpa a saída do terminal" }
          ]
        : [
            { cmd: "cd <page>", desc: "go to a page — e.g. cd stack" },
            { cmd: "ls", desc: "list all available pages" },
            { cmd: "pwd", desc: "print the current directory" },
            { cmd: "history", desc: "show past commands (↑/↓ also cycles)" },
            { cmd: "echo <text>", desc: "print the given text back" },
            { cmd: "man", desc: "opens this help panel" },
            { cmd: "whoami", desc: "who Tiago is" },
            { cmd: "lang en|br", desc: "switch language" },
            { cmd: "clear", desc: "clear the terminal output" }
          ],
      bootLines: this.BOOT_LINES.slice(0, this.state.bootStep),
      bootTyping: this.state.bootTyping,
      bootTypedCmd: this.state.bootTypedCmd,
      isHome: page === "home",
      isAbout: page === "about",
      eduTree: EDU_TREE,
      isStack: page === "stack",
      isProjects: page === "projects",
      isExperience: page === "experience",
      isContact: page === "contact",
      is404: page === "404",
      missingPath: this.state.missingPath,
      goHome: () => this._navigate("home"),
      t: I18N[lang],
      setEn: () => setLang("en"),
      setBr: () => setLang("br"),
      enBg: lang === "en" ? "#12241a" : "transparent",
      brBg: lang === "br" ? "#12241a" : "transparent",
      enColor: lang === "en" ? "#4ade80" : "#6b6b65",
      brColor: lang === "br" ? "#4ade80" : "#6b6b65",
      goContact: () => this._navigate("contact"),
      goStack: () => this._navigate("stack"),
      home0: this._homeRow(0),
      home1: this._homeRow(1),
      selHome0: () => { if (this.state.homeSel !== 0) this.setState({ homeSel: 0 }); },
      selHome1: () => { if (this.state.homeSel !== 1) this.setState({ homeSel: 1 }); },
      artFill: this.ART_FILL,
      artShade: this.ART_SHADE,
      tabs: this.PAGES.map((p) => ({
        label: TAB_LABELS[p],
        go: () => this._navigate(p),
        bg: p === page ? "#0e0e0e" : "transparent",
        color: p === page ? "#4ade80" : "#6b6b65",
        border: p === page ? "#2e4a38" : "transparent"
      })),
      stackModules: STACK_BASE.map((m, i) => ({ ...m, sub: STACK_SUBS[lang][i], count: m.techs.length })),
      stackTotal: STACK_BASE.length,
      projects: PROJ_BASE.map((p, i) => ({ ...p, desc: PROJ_DESCS[lang][i], idx: String(i + 1).padStart(2, "0"), select: () => this._selProj(i), ...this._rowStyle(ps === i) })),
      projFrames: PROJ_BASE.map((p, i) => ({ url: p.url, name: p.name, mounted: !!this.state.projVisited[i], opacity: i === ps ? 1 : 0, z: i === ps ? 2 : 1, onLoad: () => this._projLoad(i) })),
      projActive,
      projLoadingNow: !projLive,
      projStatus: projLive ? I18N[lang].projLive : I18N[lang].projLoading,
      projStatusColor: projLive ? "#4ade80" : "#8a8a84",
      expTicks,
      expRows,
      expActive: { id: ea.sha, decoText: ea.deco ? "(" + ea.deco + ")" : "", role: et.role, org: et.org, period: et.period, where: et.where, desc: et.desc, redacted: !!et.redacted, skills: ea.skills, pos: "commit " + (es + 1) + (lang === "br" ? " de " : " of ") + EXP_DATA.length },
      contactRows: CONTACTS.map((c, i) => ({ ...c, select: () => { if (this.state.contactSel !== i) this.setState({ contactSel: i }); }, ...this._rowStyle(cs === i) })),
      art404Fill: this.ART404_FILL,
      art404Shade: this.ART404_SHADE
    };
  }
}
```

