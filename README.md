
# Facechain — Face ID + Blockchain Verification

Facechain is an end-to-end verification pipeline that combines **face detection, face encoding, genuine reverse-image search, social-media evidence extraction, cryptographic hashing, and blockchain verification**.

<img width="1507" height="706" alt="image" src="https://github.com/user-attachments/assets/162dbc47-698d-47e1-824b-2cbe1c909570" />


The system is designed for the **Face ID + Blockchain Verification** hackathon challenge.

---

## 🚀 What Facechain Does

```text
User Image
    ↓
Face Detection
    ↓
Face Encoding
    ↓
Google Lens Reverse Image Search
    ↓
Social Media Match
    ↓
Evidence Record
    ↓
SHA-256 Hash
    ↓
Polygon Amoy Blockchain
    ↓
Verification Proof
````

The goal is to create a **tamper-evident verification record** from the evidence discovered during the verification process.

---

## ✨ Key Features

### 1. Face Detection

The uploaded image is processed to detect faces and determine:

* Whether a face is present
* Number of faces
* Face location

### 2. Face Encoding

The detected face is converted into a numerical face embedding using a real face-recognition model.

The embedding is generated dynamically from the uploaded image.

No hardcoded or random face vectors are used.

### 3. Genuine Reverse Image Search

Facechain uses **Google Lens through SerpApi** to perform a real reverse-image search.

The search results are obtained dynamically from the submitted image.

No hardcoded URLs or fake search results are used.

### 4. Social Media Evidence

The system checks publicly indexed search results for social-media matches.

Currently supported platforms:

* Instagram
* Facebook
* X / Twitter

When a genuine result is found, the system extracts available information such as:

* Platform
* Username/account
* Profile URL
* Post URL
* Result title
* Match type
* Source image

If no supported social-media result is found:

```text
NO SOCIAL MEDIA MATCH FOUND
```

### 5. Cryptographic Verification

The verification result is converted into a deterministic JSON record.

The record is hashed using:

```text
SHA-256
```

This creates a unique cryptographic fingerprint of the verification record.

### 6. Blockchain Proof

The record hash is anchored on the:

**Polygon Amoy Testnet**

The backend waits for the real blockchain transaction to be mined before reporting the verification as confirmed.

The original image is **not stored on the blockchain**.

### 7. Record Verification

The stored verification record can be compared against its blockchain proof to determine whether the record has been modified.

---

# 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │    React UI      │
                    │  TypeScript/Vite │
                    └────────┬─────────┘
                             │
                             │ HTTP
                             ▼
                    ┌──────────────────┐
                    │    FastAPI       │
                    │     Backend      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        Face Engine      SerpApi        Blockchain
              │         Google Lens      Polygon
              │              │              │
              ▼              ▼              ▼
        Face Embedding   Search Results   TX Hash
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Verification     │
                    │ Record + SHA-256 │
                    └──────────────────┘
```

---

# 📁 Project Structure

```text
facechain/
│
├── facechain-ui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── ...
│
├── facechain-backend/
│   ├── routes/
│   │   └── verify.py
│   │
│   ├── services/
│   │   ├── face_service.py
│   │   ├── reverse_search_service.py
│   │   ├── matcher.py
│   │   ├── hashing_service.py
│   │   └── blockchain_service.py
│   │
│   ├── contracts/
│   │   └── VerificationRegistry.sol
│   │
│   ├── main.py
│   ├── config.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn

### Computer Vision

* OpenCV
* DeepFace

### Reverse Image Search

* SerpApi
* Google Lens

### Blockchain

* Solidity
* Web3.py
* Polygon Amoy Testnet

### Cryptography

* SHA-256

---

# ⚙️ Installation

## Prerequisites

Install:

* Python 3.x
* Node.js
* npm
* Git

You will also need:

* A SerpApi API key
* A Polygon wallet
* Test POL on Polygon Amoy

---

# 🔹 Backend Setup

Open a terminal:

```powershell
cd facechain-backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create:

```text
facechain-backend/.env
```

Use `.env.example` as the template.

Example:

```env
SERPAPI_API_KEY=your_serpapi_api_key
POLYGON_RPC_URL=https://polygon-amoy.drpc.org
POLYGON_PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=
```

### ⚠️ IMPORTANT

Never commit `.env` to GitHub.

Never expose your Polygon private key in the frontend.

Blockchain credentials must remain on the backend.

---

# ▶️ Start Backend

From `facechain-backend`:

```powershell
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 🔹 Frontend Setup

Open another terminal:

```powershell
cd facechain-ui
```

Install dependencies:

```powershell
npm install
```

Create:

```text
facechain-ui/.env
```

Set:

```env
VITE_API_MODE=real
```

Start the frontend:

```powershell
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Verification Flow

## Step 1 — Upload Image

The user uploads an image through the React frontend.

The image is sent to:

```http
POST /api/verify
```

---

## Step 2 — Face Detection

The backend processes the image and detects the face.

The system records:

* Face detected
* Face count
* Bounding information

---

## Step 3 — Face Encoding

The detected face is converted into a numerical embedding.

The embedding is generated from the actual input image.

---

## Step 4 — Reverse Image Search

The image is submitted to:

```text
SerpApi → Google Lens
```

The returned results are processed dynamically.

---

## Step 5 — Social Match

Search results are checked for supported social platforms:

```text
Instagram
Facebook
X / Twitter
```

The system uses the actual URLs and metadata returned by the search provider.

It does not invent usernames or URLs.

---

## Step 6 — Evidence Record

A structured verification record is created containing information such as:

```json
{
  "record_id": "FC-XXXX",
  "input_image_sha256": "...",
  "face_detected": true,
  "face_count": 1,
  "encoding_dimensions": "...",
  "reverse_search_provider": "Google Lens via SerpApi",
  "platform": "Instagram",
  "username": "...",
  "source_url": "...",
  "timestamp": "..."
}
```

---

## Step 7 — SHA-256 Hash

The verification record is canonicalized and hashed:

```text
Verification Record
        ↓
Canonical JSON
        ↓
SHA-256
        ↓
Record Hash
```

---

## Step 8 — Polygon Blockchain

The record hash is submitted to the Polygon Amoy testnet.

The backend waits for the transaction receipt.

A successful verification returns:

* Transaction hash
* Block number
* Record hash
* Blockchain status

---

# ⛓️ Smart Contract

The smart contract is located at:

```text
facechain-backend/contracts/VerificationRegistry.sol
```

The contract stores verification hashes and emits a:

```text
VerificationStored
```

event.

Only the cryptographic verification information is anchored on-chain.

The original image is not stored on the blockchain.

---

# 🔌 API

## Verify Image

```http
POST /api/verify
```

Input:

```text
multipart/form-data
image=<image>
```

Returns information about:

* Face detection
* Face encoding
* Image hash
* Reverse-image search
* Social-media matches
* Blockchain transaction

---

## Verify Existing Record

```http
GET /api/verify-record/{record_id}
```

This endpoint verifies the integrity of an existing verification record against its blockchain proof.

---

# 🧪 Testing

For the first end-to-end test, use an image that is already publicly indexed online.

Recommended test:

```text
Upload Image
     ↓
Face Detected
     ↓
Face Encoded
     ↓
Google Lens Search
     ↓
Social Result Found
     ↓
Evidence Generated
     ↓
SHA-256 Hash Created
     ↓
Polygon Transaction
     ↓
Transaction Confirmed
```

A reverse-image search cannot guarantee a social-media result if the image has never been publicly indexed.

---

# ⚠️ Limitations

### Reverse Image Search

Results depend on third-party search indexing and API availability.

An image may produce no results even if it exists somewhere online.

### Social Media

Only publicly indexed results are considered.

Current supported platforms:

* Instagram
* Facebook
* X / Twitter

### Identity

A reverse-image match does **not** by itself prove:

* A person's identity
* Account ownership
* Image ownership
* Authenticity
* Legal ownership

The result should be treated as an evidence signal requiring appropriate interpretation.

### Blockchain

Polygon Amoy is a testnet and is used for demonstration purposes.

### Third-Party Services

The reverse-search pipeline depends on SerpApi and Google Lens availability and API limits.

---

# 🔒 Security

Facechain follows these principles:

* API keys are stored in environment variables.
* Blockchain private keys remain on the backend.
* Private keys are never sent to the frontend.
* Original images are not stored on-chain.
* Only verification hashes are anchored on blockchain.
* `.env` files must never be committed to source control.

---

# 🎥 Demo

The complete demonstration follows:

```text
UPLOAD
   ↓
FACE DETECTION
   ↓
FACE ENCODING
   ↓
REVERSE IMAGE SEARCH
   ↓
SOCIAL MATCH
   ↓
EVIDENCE
   ↓
SHA-256
   ↓
POLYGON
   ↓
VERIFICATION
```

The demonstration is performed using the real backend pipeline rather than pre-populated search results.

---

# 🏆 Hackathon Objective

Facechain combines:

```text
Computer Vision
      +
Reverse Image Search
      +
Cryptographic Hashing
      +
Blockchain
```

into one verification workflow.

The system creates a **tamper-evident record of the verification evidence**, allowing the integrity of that record to be checked independently.

---

# 📜 Disclaimer

Facechain is a hackathon prototype.

Search results depend on third-party indexing and APIs.

A reverse-image match should not be interpreted as definitive proof of identity, ownership, or authenticity without additional verification.

---

## Facechain

**Detect → Search → Verify → Prove**

```
```
