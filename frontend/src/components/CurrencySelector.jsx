
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

const CurrencySelector = ({ contractAddress, contractABI }) => {
  const [selectedFeed, setSelectedFeed] = useState("");
  const [price, setPrice] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (!provider || !signer || !selectedFeed) {
      return;
    }

    
    fetchLastFetchedPrice();
  }, [selectedFeed, provider, signer]);

 
  const feedId =
    ["BTC/ETH", "BTC/USD", "ETH/USD", "LINK/USD"].indexOf(selectedFeed) + 1;
  console.log(feedId);

  const formatBigIntWithDecimals = (value, decimals) => {
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    let fractionalPart = value % divisor;

    
    const fractionalPartStr = fractionalPart.toString().padStart(decimals, "0");

   
    return `${integerPart}.${fractionalPartStr}`;
  };

  const fetchPrice = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const localProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(localProvider);
      const localSigner = await localProvider.getSigner();
      setSigner(localSigner);
      const priceFeedContract = new ethers.Contract(
        contractAddress,
        contractABI,
        localSigner
      );

    
      const updateTx = await priceFeedContract.updatePrice(feedId);
      await updateTx.wait();

      const fetchedPrice = await priceFeedContract.getLastFetchedPrice(feedId);
      console.log(fetchedPrice);
      console.log(typeof fetchedPrice);

      
      let formattedPrice;
      if (selectedFeed === "BTC/ETH") {
        
        formattedPrice = formatBigIntWithDecimals(fetchedPrice, 18);
      } else {
       
        formattedPrice = formatBigIntWithDecimals(fetchedPrice, 8);
      }
      console.log(formattedPrice);
      setPrice(formattedPrice); 
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred, please check the console.");
    }
  };

  const fetchLastFetchedPrice = useCallback(async () => {
    if (!signer || !selectedFeed) {
      return;
    }

    try {
      const priceFeedContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const feedId =
        ["BTC/ETH", "BTC/USD", "ETH/USD", "LINK/USD"].indexOf(selectedFeed) + 1;
      
      const fetchedPrice = await priceFeedContract.getLastFetchedPrice(feedId);

      console.log(fetchedPrice);

      
      const formattedPrice =
        selectedFeed === "BTC/ETH"
          ? formatBigIntWithDecimals(fetchedPrice, 18)
          : formatBigIntWithDecimals(fetchedPrice, 8);

      setPrice(formattedPrice);
    } catch (error) {
      console.error("Error fetching last price:", error);
    }
  }, [signer, selectedFeed, contractAddress, contractABI]);

  useEffect(() => {
    fetchLastFetchedPrice();
  }, [fetchLastFetchedPrice]);

  return (
    <div className="currency-selector">
      <form>
        <label>
          <input
            type="radio"
            value="BTC/ETH"
            checked={selectedFeed === "BTC/ETH"}
            onChange={(e) => setSelectedFeed(e.target.value)}
          />
          BTC/ETH
        </label>
        <label>
          <input
            type="radio"
            value="BTC/USD"
            checked={selectedFeed === "BTC/USD"}
            onChange={(e) => setSelectedFeed(e.target.value)}
          />
          BTC/USD
        </label>
        <label>
          <input
            type="radio"
            value="ETH/USD"
            checked={selectedFeed === "ETH/USD"}
            onChange={(e) => setSelectedFeed(e.target.value)}
          />
          ETH/USD
        </label>
        <label>
          <input
            type="radio"
            value="LINK/USD"
            checked={selectedFeed === "LINK/USD"}
            onChange={(e) => setSelectedFeed(e.target.value)}
          />
          LINK/USD
        </label>
      </form>
      <button onClick={fetchPrice}>Submit</button>
      {price && (
        <p>
          The latest price of {selectedFeed} is: {price}
        </p>
      )}
    </div>
  );
};

export default CurrencySelector;

CurrencySelector.propTypes = {
  contractAddress: PropTypes.string.isRequired,
  contractABI: PropTypes.array.isRequired,
};
