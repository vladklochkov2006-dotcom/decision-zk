import { PinataSDK } from "pinata-web3";

// ⚠️ ТИМЧАСОВО: Вставляємо ключ прямо сюди.
// Потім ми винесемо це в .env файл або на бекенд.
const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZTU1M2ZlNy04MWNmLTRkODgtYTUzMi03OTg4MTI4NDNlODQiLCJlbWFpbCI6InZsYWRrbGlja292MjAwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzhjODFmYzNjMDRhNDA4MzA4YzIiLCJzY29wZWRLZXlTZWNyZXQiOiJlMjc3ODg5MDcyOGFkMjk4ZjEyY2FjNDA4N2Q1NDU3YjFhZWVhNTJlMDgyMGI2MzczOTVjNGM5NjRlNjJmYTA3IiwiZXhwIjoxODAyMjkwODgxfQ.jA_sLaIMbZkok4IA6fKXUDpNLjvUfTN750QrnwPKjMY";

const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: "example-gateway.mypinata.cloud", // Це стандартний шлюз, поки ок
});

export const uploadToIPFS = async (text: string) => {
    try {
        // Створюємо файл з тексту
        const file = new File([text], "post.txt", { type: "text/plain" });

        // Вантажимо
        const upload = await pinata.upload.file(file);

        // Повертаємо хеш (CID)
        // console.log("Файл в IPFS:", upload.IpfsHash);
        return upload.IpfsHash;
    } catch (error) {
        console.error("Помилка IPFS:", error);
        throw error;
    }
};