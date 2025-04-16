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
      document.getElementById("wallet-address").innerText = `Conectado: ${address}`;
      document.querySelector('button.cta').innerText = "Wallet Conectada";

      console.log("Conexão estabelecida:", address);
    } catch (err) {
      alert("Erro ao conectar ou trocar rede.");
      console.error(err);
    }
  } else {
    alert("MetaMask não detectado.");
  }
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
