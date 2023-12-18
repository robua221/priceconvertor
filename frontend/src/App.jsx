import "./App.css";
import CurrencySelector from "./components/CurrencySelector";
import contractABI from "./contracts/currency.json";


const contractAddress = "0x286aD62Cc2E415340c4820946e2c1d042d61b045";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <CurrencySelector
          contractAddress={contractAddress}
          contractABI={contractABI}
        />
      </header>
    </div>
  );
}

export default App;
