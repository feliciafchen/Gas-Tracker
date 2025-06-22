# Gas Tracker – Route Fuel Cost Calculator

Gas Tracker is a React + TypeScript web application that helps drivers estimate **how much a road-trip will cost in fuel** before they leave the driveway.

The app combines:

- **Google Maps Directions & Places** – for turn-by-turn routing and address auto-complete.
- **fueleconomy.gov** REST API – to look up factory fuel-efficiency data for every make / model / year sold in the USA.
- **User-supplied gas price** – so calculations reflect the real-world cost at the pump.

The result is a simple UI that shows total distance, gallons needed and out-of-pocket cost for any trip – including multiple stops.

---

## ✨ Key Features

• Address auto-complete powered by Google Places.<br/>
• Add as many **intermediate stops** as you like – we'll optimise the route in the order entered.<br/>
• Select **vehicle year → make → model** and we'll fetch its official combined MPG rating automatically.<br/>
• Enter the **current price per gallon** (validated client-side).<br/>
• Immediate **trip summary** with total miles and estimated cost.<br/>
• Fully typed codebase, unit-tested with React Testing Library and end-to-end-tested with Cypress.<br/>

---

## 🏗️ Project Structure

```text
src/
 ├─ components/          # Re-usable UI & feature components
 │   ├─ MapContainer/    # <MapContainer> (wraps Google Map + Directions panel)
 │   ├─ RouteInput/      # Origin, destination & stops inputs
 │   ├─ VehicleInput/    # Vehicle selector with API calls
 │   ├─ GasPriceInput/   # Gas price field with validation
 │   └─ TripSummary.tsx  # Displays distance & cost
 │
 ├─ services/            # External API helpers (FuelEconomy.gov)
 ├─ App.tsx              # Top-level composition
 └─ ...
```

Tests live next to the code they cover (e.g. `VehicleInput.test.tsx`) and Cypress specs are located under `cypress/e2e`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** (comes with Node) or **pnpm** / **yarn**
- A **Google Cloud project** with **Maps JavaScript API** and **Places API** enabled

### 1. Clone & install

```bash
$ git clone https://github.com/your-username/gas-tracker.git
$ cd gas-tracker
$ npm install            # or pnpm install / yarn
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
# .env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
# Optional but recommended for custom map styling (must start with `REACT_APP_` when using CRA)
REACT_APP_GOOGLE_MAP_ID=YOUR_MAP_ID
```

> CRA only exposes variables prefixed with `REACT_APP_` to the browser. **Never commit the real keys to Git.**

### 3. Run the development server

```bash
$ npm start
```

Open <http://localhost:3000> – the app reloads on save and shows build errors in the console.

---

## 🧪 Running Tests

### Unit & integration tests (Jest + RTL)

```bash
$ npm test
```

Press `a` to run all tests or `p` to filter by filename.

### End-to-end tests (Cypress)

```bash
# Interactive runner
$ npm run cypress:open

# Headless CI run
$ npm run test:e2e
```

The e2e script spins up the development server, waits for <http://localhost:3000>, then executes Cypress specs.

---

## 🛠️ Available Scripts

| command                | purpose                                |
| ---------------------- | -------------------------------------- |
| `npm start`            | Launch dev server with hot-reload      |
| `npm run build`        | Production build (outputs to `build/`) |
| `npm test`             | Jest + React Testing Library suite     |
| `npm run cypress:open` | Cypress interactive runner             |
| `npm run test:e2e`     | Headless e2e on a built app            |
| `npm run eject`        | CRA escape-hatch – **irreversible**    |

---

## 📦 Deploying

After `npm run build`, upload the contents of the `build/` directory to any static host (Netlify, Vercel, S3, Firebase Hosting, GitHub Pages + gh-actions, …). Remember to supply the Google Maps API key as an environment variable (or inject it during the build step).

---

## 🤝 Contributing

1. Fork the repo & create a feature branch: `git checkout -b feat/my-feature`
2. Follow existing code style & add/maintain tests.
3. Submit a PR describing **why** and **what** you changed.

All contributions – bug fixes, new features, performance tweaks, docs – are welcome!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information (or add one if missing).

---

## 🙏 Acknowledgements

- [@vis.gl/react-google-maps](https://github.com/visgl/react-google-maps) for the modern, composable Map components.
- [FuelEconomy.gov](https://www.fueleconomy.gov/) for providing the public fuel-efficiency dataset.
- [Create React App](https://create-react-app.dev/) for zero-config React tooling.
