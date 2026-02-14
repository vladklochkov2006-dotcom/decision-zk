# Decision.ZK - Anonymous Governance Protocol

**A privacy-first governance layer built on the Aleo blockchain that enables verifiable decision-making, anonymous voting, and reputation-based signaling without compromising user identity.**

Live Application: [Decision.ZK Terminal](http://localhost:5173)  
Smart Contract: `v_klochkov_private_decision_v1.aleo`

---

## ⚡ Features

### Core Capabilities

- **Blind Voting**: Votes are encrypted and proved using Aleo's zero-knowledge cryptography. No one—not even the creator—can see the vote distribution until the reveal phase.
- **Reputation Staking (ZK-REP)**: Users stake accumulated reputation tokens on their decisions. Successful predictions or majority-aligned votes yield **2x rewards**, creating a meritocratic feedback loop.
- **Paid "Alpha" Access**: Encrypted content streams that require on-chain proof of payment (`unlock_content`) to decrypt.
- **Anonymous Social Proof**: Comment and discuss proposals using zero-knowledge badges (e.g., "Top 5% Staker", "Verifier Node") without linking to a specific public address.
- **Sybil Resistance**: Leveraging Aleo's Proof-of-Succinct-Work (PoSW) mechanics and record-gating to ensure one-person-one-vote where enforced.

### User Experience

- **Terminal Interface**: A developer-focused, keyboard-centric UI with neon aesthetics.
- **Cross-Wallet Support**: Seamless integration with **Leo Wallet** and **Shield Wallet** (via adapters).
- **Optimistic UI**: Instant feedback on ZK-transactions while proofs generate in the background.
- **AI Governance Assistant**: Sidebar AI helper that contexts-switch based on active proposals.

---

## 🏗 Architecture

Decision.ZK follows a privacy-preserving three-layer architecture:

### Layer 1: Client (React + Vite)
The execution layer responsible for:
- **Proof Generation**: Constructs inputs for `vote_private` and `create_dilemma`.
- **Wallet Handshake**: Manages session keys and decrypts private records via wallet adapters.
- **State Management**: Optimistic updates using `eventemitter3` for a snappy feel despite block times.

### Layer 2: Protocol (Leo Smart Contract)
The `v_klochkov_private_decision_v1.aleo` program enforces:
- **Double-Spend Protection**: Consumes private records upon voting.
- **Vote Integrity**: `assert(vote_choice == 0 || vote_choice == 1)` within the circuit.
- **Reward Logic**: Minting logic for `ZK-REP` based on resolution outcomes.

### Layer 3: Indexer & Storage (Supabase)
The persistence layer providing:
- **Encrypted Metadata**: Stores non-sensitive proposal details (titles, descriptions).
- **Transaction History**: Agnostic indexing of generic Aleo transaction IDs for UI history.
- **Discussion Threads**: Off-chain encrypted comments linked to on-chain proposal IDs.

**Data Flow:**
User Action → Client Proof Gen → Aleo Network → Record Consumption → Indexer Sync → UI Update

---

## �️ Path to Full Privacy (Post-MVP)

While the current architecture relies on Supabase for indexing (MVP phase), we acknowledge that centralized databases can leak metadata (IP addresses, timestamps). To achieve **100% permissionless privacy**, the following upgrades are on the roadmap:

1.  **Network Anonymity (Nym Mixnet)**:
    - **Current**: Direct HTTP requests expose user IPs to the server.
    - **Upgrade**: Route all client traffic through **Nym Loopix Mixnet**, making network traffic unlinkable and seemingly random, effectively hiding the user's physical location.

> **Note on Encryption**: The current MVP uses **Zero-Knowledge Blinding** (hiding the voter identity) rather than **Fully Homomorphic Encryption** (computing on encrypted data). While votes are private, the aggregate count is publicly incremented. Future versions will implement **Threshold Decryption** or **Multi-Party Computation (MPC)** for completely blinded tallies until the reveal phase.

2.  **Decentralized Storage (IPFS / Arweave)**:
    - **Current**: Encrypted comments stored in Postgres.
    - **Upgrade**: Move discussion data to **IPFS** (InterPlanetary File System) or **Arweave**. Content is content-addressed (hashing) and distributed across a mesh of nodes, removing the central point of censorship.

3.  **P2P Database (OrbitDB / Waku)**:
    - **Current**: Global state synced via Supabase Realtime.
    - **Upgrade**: Implement **Waku** (successor to Whisper) for peer-to-peer ephemeral messaging and **OrbitDB** for serverless, distributed database management directly between clients.

---

## �🛠 Technology Stack

**Blockchain / ZK**
- **Network**: Aleo Testnet Beta
- **Language**: Leo (Smart Contracts)
- **Encryption**: BHP256 Hashing, AES-256-GCM (Off-chain data)

**Frontend**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom Variables, no Tailwind bloat)
- **Icons**: Lucide React

**Backend / Services**
- **Database**: Supabase (PostgreSQL)
- **Wallet Adapters**: `@demox-labs/aleo-wallet-adapter`, `@provablehq/shield`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Leo Wallet or Shield Wallet extension
- Aleo SDK (optional for CLI interactions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/decision-zk.git
   cd decision-zk
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file:
   ```env
   VITE_ALEO_NETWORK=testnetbeta
   VITE_PROGRAM_ID=v_klochkov_private_decision_v1.aleo
   VITE_SUPABASE_URL=your_sb_url
   VITE_SUPABASE_ANON_KEY=your_sb_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📜 Smart Contract Transitions

### 1. `create_dilemma`
Initializes a new governance proposal.

**Inputs:**
- `hash`: `field` (Content hash of title/desc)
- `type`: `u8` (0 = Standard, 1 = Financial)
- `end_height`: `u32` (Block height for voting deadline)

**Output:**
- `dilemma_record`: A private record owned by the creator.

### 2. `vote_private`
Casts a shielded vote.

**Inputs:**
- `proposal_id`: `u64`
- `choice`: `boolean` (true = Support, false = Oppose)
- `amount`: `u64` (Optional stake amount of ZK-REP)

**Behavior:**
- Consumes user's `ZK-REP` record.
- Emits a hashed vote event.
- Updates the private aggregate state (via mapping or record chaining).

### 3. `unlock_content`
Purchases access to a `PaidPost`.

**Inputs:**
- `post_id`: `u64`
- `payment_record`: `credits` (The input record to spend)
- `merchant`: `address`

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── VotingCard.tsx       # Core voting interface with slider
│   ├── DiscussionSection.tsx # Chat with ZK-badges
│   ├── ZKProofModal.tsx     # Visualizer for proof generation
│   ├── AiAssistant.tsx      # Sidebar AI agent
│   └── ZKLogo.tsx           # Shield/Molecule branding
├── hooks/
│   └── useWallet.ts         # Wrapper for adapter logic
├── types/
│   └── index.ts             # Shared interfaces (Dilemma, VoteRecord)
├── App.tsx                  # Main router and global state
└── main.tsx                 # Entry point
```

---

## 🔐 Security & Privacy

- **Record-Based State**: User balances and vote status are stored in private records, never in public mappings.
- **Client-Side Hashing**: All content proofs are generated locally; raw choices never leave the client.
- **Auditability**: While individual votes are private, the *total* tally utilizes homomorphic encryption properties to ensure the sum is mathematically valid without revealing components.

---

## 🗺 Roadmap

- [x] **Phase 1: MVP Core** (Voting, Wallet Connect, Basic UI)
- [x] **Phase 2: Social Layer** (Anonymous Chat, Badge System)
- [x] **Phase 3: Branding** (Decision.ZK Identity, Favicon)
- [ ] **Phase 4: Mainnet Launch** (Deploy contracts to Aleo Mainnet)
- [ ] **Phase 5: Mobile App** (React Native integration)

---

## 🤝 Contributing

We welcome contributions to the Zero-Knowledge future.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

**Built with 🛡️ on Aleo**
