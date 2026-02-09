### Clima Mágico

Aplicação web responsiva de previsão do tempo com visual inspirado em ilustrações no estilo “Studio Ghibli”. O usuário pesquisa uma cidade e a interface se adapta dinamicamente às condições climáticas (cores, card e ilustração).

#### Destaques

- Busca de cidade por nome (geocoding).
- Clima atual (temperatura, umidade, vento e código de condição).
- “Mood” visual por condição (fundo ao redor da aplicação muda conforme o clima).
- Card central com ilustração temática e forecast por hora (primeiras horas).
- Interface responsiva (desktop e mobile).
- Projeto simples (sem autenticação, sem backend próprio).

#### Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS v4 + plugin `@tailwindcss/vite`
- Open-Meteo (Geocoding + Forecast)

#### API (Open-Meteo)

- Geocoding (cidade → latitude/longitude)  
  Endpoint: `https://geocoding-api.open-meteo.com/v1/search`

- Forecast (clima atual e série horária)  
  Endpoint: `https://api.open-meteo.com/v1/forecast`

Parâmetros principais utilizados:

- `current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`
- `hourly=temperature_2m`
- `timezone=auto`

Documentação:

- Open-Meteo: [https://open-meteo.com/](https://open-meteo.com/)

#### Mapeamento de condições (weather_code → tema)

A Open-Meteo retorna `weather_code` (WMO). O app converte para temas visuais:

- `0–1` → `clear` (ensolarado)
- `2–3` → `cloudy` (nublado)
- `51–67` → `rainy` (chuva/garoa)
- `71–77` → `snowy` (neve)

#### Ilustrações (assets)

As ilustrações do card (geradas para o projeto) estão nas URLs abaixo e podem ser usadas diretamente via `img src`:

- Ensolarado (clear):  
  [https://cdn.abacus.ai/images/833867bd-6be6-4283-8daa-e8838f98b190.png](https://cdn.abacus.ai/images/833867bd-6be6-4283-8daa-e8838f98b190.png)

- Nublado (cloudy):  
  [https://cdn.abacus.ai/images/7a5219b3-8b68-4ee6-98a9-58268df8243e.png](https://cdn.abacus.ai/images/7a5219b3-8b68-4ee6-98a9-58268df8243e.png)

- Chuvoso (rainy):  
  [https://cdn.abacus.ai/images/85278324-0576-4af4-bf32-bc868dea9657.png](https://cdn.abacus.ai/images/85278324-0576-4af4-bf32-bc868dea9657.png)

- Nevando (snowy):  
  [https://cdn.abacus.ai/images/f770b63b-b7e4-4971-9b6d-2e7b4c331c1a.png](https://cdn.abacus.ai/images/f770b63b-b7e4-4971-9b6d-2e7b4c331c1a.png)

#### Estrutura sugerida do projeto

- `src/`
  - `App.tsx` — UI principal, busca, estados e render
  - `main.tsx` — bootstrap do React
  - `index.css` — Tailwind v4 (`@import "tailwindcss";`)
- `public/`
  - `favicon.ico` / `favicon.png`
  - (opcional) `illustrations/` — imagens locais

#### Tailwind CSS v4 (nota de configuração)

Configuração típica utilizada:

- `src/index.css` com `@import "tailwindcss";`
- `vite.config.ts` com plugin `@tailwindcss/vite`

#### Estado atual / limitações conhecidas

- O seletor de dias da semana pode estar implementado inicialmente como estado visual (UI), e pode ser evoluído para consumir forecast diário (`daily=...`) e renderizar dados por dia.
- “Por hora” pode ser ajustado para exibir as próximas horas a partir do horário atual (em vez de sempre começar do índice 0).

#### Próximos passos (idéias)

- Adicionar `daily=temperature_2m_max,temperature_2m_min,weather_code` e tornar o seletor de dias funcional.
- Adicionar tema `stormy` (tempestade) e `foggy` (neblina).
- Melhorar acessibilidade (contraste, foco visível, labels e aria).
- Cache de buscas recentes.
- Autocomplete de cidades.

#### Créditos

- Dados meteorológicos: Open-Meteo — [https://open-meteo.com/](https://open-meteo.com/)
- UI/UX: inspirada nas referências visuais fornecidas (cards ilustrados e paletas por clima).
