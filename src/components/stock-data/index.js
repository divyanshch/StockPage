import React, { useEffect, useState } from "react";
import "./index.css";

export default function StockData() {
  const BASE_URL = 'https://jsonmock.hackerrank.com/api/stocks?date=';

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    // convert to enum in typescript.
    const StockDataComponentErrorMessages = {
      SERVER_ERROR: 'Issues connecting to server...',
    }
    const getData = () => {
      setErrorMessage('');
      setStockItems([]);

      if (!query && new Date(query)) {
        return;
      };

      setIsLoading(true);
      const requestUrl = `${BASE_URL}${query}`;

      fetch(requestUrl).then((response) => {
        return response.json();
      }).then((res) => {
        setStockItems(res.data);
      }).catch((error) => {
        setErrorMessage(StockDataComponentErrorMessages.SERVER_ERROR);
        console.error({ error });
      }).finally(() => {
        setIsLoading(false);
      });
    };

    getData();
  }, [query]);

  const errorComponent = (
    <ul className="mt-50 slide-up-fade-in styled" id="errorFetchingData" data-testid="error-fetching-data">
      <h1>Error: {errorMessage}</h1>
      <h3>Please try again later.</h3>
    </ul>
  )

  const loadingComponent = (
    <ul className="mt-50 slide-up-fade-in styled" id="loadingData" data-testid="loading-data">
      <h1>Loading...</h1>
    </ul>
  )

  const emptyComponent = (
    <div className="mt-50 slide-up-fade-in" id="no-result" data-testid="no-result">
      <h1>No Results Found</h1>
    </div>
  );

  const stockItemComponent = (stockItem) => (
    <ul className="mt-50 slide-up-fade-in styled" id="stockData" data-testid="stock-data" key={stockItem.date}>
      <li className="py-10">Open: {stockItem.open}</li>
      <li className="py-10">Close: {stockItem.close}</li>
      <li className="py-10">High: {stockItem.high}</li>
      <li className="py-10">Low: {stockItem.low}</li>
    </ul>
  );

  const computeDataComponent = (isLoading, query, stockItems) => {
    if (isLoading) return loadingComponent;
    if (errorMessage) return errorComponent;
    if (!query) return undefined;
    if (!stockItems.length) return emptyComponent;
    if (stockItems.length) {
      return stockItems.map((stockItem) => {
        return stockItemComponent(stockItem);
      });
    }
    return errorComponent;
  }

  return (
    <div className="layout-column align-items-center mt-50">
      <section className="layout-row align-items-center justify-content-center">
        <input type="text" className="large" placeholder="5-January-2000" id="app-input" data-testid="app-input" value={search}
          onChange={(event) => { setSearch(event.target.value); }}
        />
        <button className="" id="submit-button" data-testid="submit-button" onClick={() => setQuery(search)}>Search</button>
      </section>
      {computeDataComponent(isLoading, query, stockItems)}
    </div>
  );
}
