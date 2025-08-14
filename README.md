Alright — here’s your **final combined `README.md`** with the MIT License included in the same file so it’s fully self-contained for GitHub.

---

## 📄 `README.md`

````markdown
# 🧠 NFT Intelligence MCP Server

NFT Intelligence MCP Server is a **Model Context Protocol (MCP) server** that provides real-time NFT data from marketplaces such as OpenSea, Magic Eden, and others.

It offers powerful tools for NFT analytics, including:
- Current Floor Price
- Recent Sales
- NFT Rarity
- Top Holders
- NFT Metadata
- Floor Price Alerts

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/nft-intelligence-mcp.git
   cd nft-intelligence-mcp
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**
   Copy from `.env.example` and fill in your API keys:

   ```bash
   cp .env.example .env
   ```

4. **Run in development mode**

   ```bash
   npm run mcp
   ```

5. **Build & run in production**

   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Environment Variables

Create a `.env` file with the following keys:

```env
OPENSEA_API_KEY=your_opensea_api_key
MAGICEDEN_API_KEY=your_magiceden_api_key
TRAITSNIPER_API_KEY=your_traitsnipe_api_key
```

---

## 🔧 Available Tools

| Tool               | Description                                        |
| ------------------ | -------------------------------------------------- |
| `getFloorPrice`    | Fetch the current floor price of an NFT collection |
| `getFloorListings` | Fetch the lowest listings for a collection         |
| `getRecentSales`   | Retrieve the most recent NFT sales                 |
| `getNFTRarity`     | Check the rarity of an NFT                         |
| `getTopHolders`    | List the top holders of a collection               |
| `getNFTMetadata`   | Retrieve NFT metadata                              |
| `alertFloorPrice`  | Trigger alerts when floor price hits a target      |

---

## 🛠 Server Config (for ChainOpera)

```json
{
  "mcpServers": {
    "nft-intelligence": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "env": {
        "OPENSEA_API_KEY": "YOUR_OPENSEA_API_KEY",
        "MAGICEDEN_API_KEY": "YOUR_MAGICEEDEN_API_KEY",
        "TRAITSNIPER_API_KEY": "YOUR_TRAITSNIPER_API_KEY"
      }
    }
  }
}
```

