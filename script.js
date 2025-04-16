console.log("Site Brazuka carregado com sucesso!");

// Função para conectar a carteira MetaMask
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await provider.send("eth_requestAccounts", []);

      // Verifica a rede e tenta trocar para a BSC, se necessário
      const network = await provider.getNetwork();
      if (network.chainId !== 56) {
        await switchToBSC();
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Mostra o endereço conectado no HTML
      const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
document.getElementById("wallet-address").innerText = `Conectado: ${shortened}`;
      document.querySelector('button.cta').innerText = "Wallet Conectada";
      // ...
const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
document.getElementById("wallet-address").innerText = `Conectado: ${shortened}`;
document.querySelector('button.cta').innerText = "Wallet Conectada";

await mostrarSaldoBRAZ(); // <- Adicione isso aqui

console.log("Conexão estabelecida:", address);

      console.log("Conexão estabelecida:", address);
    } catch (err) {
      alert("Erro ao conectar ou trocar rede.");
      console.error(err);
    }
  } else {
    alert("MetaMask não detectado.");
  }
}

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function mostrarSaldoBRAZ() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  const tokenAddress = "0xD9E90DF21F4229249E8841580cDE7048bF935710"; // Coloque o endereço do contrato BRAZUKA
  const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

  const rawBalance = await contract.balanceOf(address);
  const decimals = await contract.decimals();
  const balance = ethers.utils.formatUnits(rawBalance, decimals);

  document.getElementById("wallet-balance").innerText = `Saldo BRAZ: ${balance}`;
}

// Função para adicionar ou trocar para a Binance Smart Chain
async function switchToBSC() {
  const bscMainnet = {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com']
  };

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [bscMainnet]
    });
    console.log("Rede trocada para Binance Smart Chain.");
  } catch (error) {
    console.error("Erro ao trocar para BSC:", error);
  }
}
