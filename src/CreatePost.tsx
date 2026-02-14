import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { uploadToIPFS } from "./utils";

export const CreatePost = () => {
    const { wallet, publicKey } = useWallet();
    const [text, setText] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
        if (!text) return;
        if (!publicKey || !wallet) {
            setStatus("❌ Гаманець не підключено!");
            return;
        }

        setIsLoading(true);
        setStatus("⏳ 1/2: Завантаження в IPFS...");

        try {
            // 1. IPFS
            const ipfsHash = await uploadToIPFS(text);
            setStatus(`✅ IPFS збережено! Hash: ${ipfsHash.slice(0, 10)}...`);

            // 2. Aleo
            setStatus("⏳ 2/2: Відкриваємо гаманець...");

            const inputs = [
                "1field",
                "2field",
                "0u64"
            ];

            const aleoTransaction = Transaction.createTransaction(
                publicKey,
                WalletAdapterNetwork.TestnetBeta, // <--- ОСЬ ТУТ БУЛА ПОМИЛКА! (Замінили Testnet на TestnetBeta)
                "private_feed.aleo",
                "create_post",
                inputs,
                100000
            );

            if (wallet.adapter.requestTransaction) {
                const txId = await wallet.adapter.requestTransaction(aleoTransaction);
                setStatus(`🎉 Транзакція успішна! ID: ${txId}`);
            }

        } catch (error: any) {
            console.error(error);
            setStatus(`⚠️ ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-post-box">
            <h3>Створити новий пост</h3>

            <textarea
                className="post-input"
                placeholder="Напиши щось..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div className="actions">
                <button
                    className="post-btn"
                    onClick={handlePost}
                    disabled={!text || isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? "Обробка..." : "Опублікувати в Aleo"}
                </button>
            </div>

            {status && <p className="status-text">{status}</p>}
        </div>
    );
};