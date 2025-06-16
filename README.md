# 🟣 PAISA — Donations for Migrants

**Paisa** is a Web3 mini-application that enables **direct donations to vulnerable migrants**, without banks or bureaucracy. Built on **Sherry SDK**, this app allows anyone in the world to contribute AVAX in a simple, transparent, and secure way.

---

## 🧩 Key Features

- 🔄 **Random rotation of the active beneficiary** (automatically updates to support different people)
- 🎯 **AVAX donations** sent directly to the current beneficiary's wallet
- 📡 Fully on-chain: beneficiary history, balance, and transactions

---

## 🔧 Tech Stack

- Smart contracts in Solidity
- Sherry SDK (Dynamic Actions)
- Next.js 14 + App Router
- wagmi + viem (for transaction serialization)
- Supabase (image storage)
- Blockchain: Avalanche Fuji (testnet)

---

## 🚀 Local Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Paisa-AVAX/PaisaAVAX.git
cd app/api/mi-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser at: `http://localhost:3000/api/my-app`

---

## 🔁 Sherry Integration

This app can be integrated directly at: [https://app.sherry.social/home](https://app.sherry.social/home)

### 📥 Form Metadata (GET endpoint):

- Retrieves the current beneficiary's data from the smart contract.
- Displays their story, image, and wallet.
- Generates two dynamic actions:
  - Donate a specific amount of AVAX
  - Randomly change the current beneficiary

### 🔁 Dynamic Action `/api/mi-app/refresh`:

```ts
// Randomly change the currently active beneficiary
// Returns the serialized transaction to be executed onchain
```

### 🎯 Dynamic Action `/api/mi-app`:

```ts
// Accepts 'amount' via query or body
// Returns the serialized transaction to donate to the current beneficiary
```

---

## 📸 App Preview

### 🧑‍🎓 Current Beneficiary
<img src="https://kubsycsxqsuoevqckjkm.supabase.co/storage/v1/object/public/PCP//miguelA.png" alt="avatar" width="150"/>

### 🧾 Story
> He fled Honduras after losing his carpentry shop to gang extortion. His eldest son was murdered, and now he dreams of rebuilding a safe life for his family.

### 💸 Sherry Interface Integration
![sherry app screen](https://your-screenshot-url.png)

🎥 Watch demo video [here](https://link-to-your-demo-video.com)

---

## 🧠 Smart Contract Deployment

```solidity
function donate() external payable {
    Beneficiary storage b = beneficiaries[currentBeneficiary];
    b.balance += msg.value;
    transactions[b.wallet].push(msg.value);
    emit DonationReceived(b.wallet, msg.value);
}
```

---

## 💬 Contributions

Want to improve or expand this app with support for stablecoins, Lens integration, or card payments? PRs and new ideas are welcome!

---

## 🤝 Credits

Developed by:
- vr4ux23  
- Dany Kubs  
- zekibestia  
- Mich  
- Jorge E  

Project submitted to the **Triggers Not Apps Hackathon** by Sherry + Avalanche.

---

