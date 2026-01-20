// Wallet connect
const connectBtn = document.getElementById("connectBtn");

connectBtn.onclick = async () => {
  if (window.ethereum) {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    connectBtn.innerText =
      accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);
  } else {
    alert("Please install MetaMask");
  }
};

// Dark mode toggle
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
}
