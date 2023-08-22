import { doc, collection, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import Web3 from 'web3';
import { db } from '../../firebase/firebase';

export const fetchEthereumAddress = async (userName: string) => {
    const usersQuery = query(collection(db, "users"), where("userName", "==", userName));
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        return userDoc.data().ethereumAddress || null;
    }
    return null;
};

export const updateCurrentBy = async (cid: string, newUserName: string) => {
    try {
        const q = query(collection(db, "routes"), where("cid", "==", cid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            const routeDocRef = doc.ref;
            await updateDoc(routeDocRef, { currentBy: newUserName });
        });
    } catch (error) {
        console.error("Error updating currentBy:", error);
    }
};

export const getUserNameFromFirestore = async (uid: string): Promise<string | null> => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data().userName || null;
    }
    return null;
};

export const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } else {
        throw new Error('MetaMask is not installed.');
    }
};

export const sendTransaction = async (receiver: string, amountInEther: string) => {
    const sender = await connectMetaMask();
    const web3: Web3 = new Web3(window.ethereum);
    const amountInWei = web3.utils.toWei(amountInEther, 'ether');

    return window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
            from: sender,
            to: receiver,
            value: amountInWei
        }],
    });
};
