import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";


import logo from "./assets/img/logo.jpg";

function App() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://site--deliveroo--gpvxp89pqghq.code.run/"
      );
      console.log(response.data);
      setData(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const totalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += parseFloat(item.price) * item.quantity;
    });
    return total.toFixed(2);
  };

  const addToCart = (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
    let shortTitle = item.title.split(' ').slice(0, 3).join(' '); // Raccourcir le titre à trois mots maximum
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1, title: shortTitle }]);
    }
  };

  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    setCart(updatedCart);
  };

  const decreaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id ) {
        if (cartItem.quantity === 1) {
          return null
        } else {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
      }
      return cartItem;
    }).filter(Boolean);
    setCart(updatedCart);
  };

  return isLoading ? (
    <p>Loading ...</p>
  ) : (
    <>
      <header>
        <div className="container">
          <img src={logo} alt="deliveroo logo" />
        </div>
      </header>
      <section>
        <div className="container hero-container">
          <div>
            <h1>{data.restaurant.name}</h1>
            <p className="resto-descr">{data.restaurant.description}</p>
          </div>
          <img src={data.restaurant.picture} alt="miam" />
        </div>
      </section>
      <main>
        <div className="container main-container">
          <section className="col-left">
            {data.categories.map((category) => {
              if (category.meals.length !== 0) {
                return (
                  <div key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="articles-container">
                      {category.meals.map((meal) => {
                        return (
                          <article key={meal.id} onClick={() => addToCart(meal)}>
                            <div>
                              <h3 className="sub-title">{meal.title}</h3>
                              <p className="description resto-descr">{meal.description}</p>
                              <span className="resto-descr">{meal.price} €</span>
                              {meal.popular &&
                                <span className="pop">
                                  <svg className="etoile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg> Populaire
                                </span>
                              }
                            </div>
                            {meal.picture && <img src={meal.picture} alt={meal.title} />}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="col-right Cart">
            <div className="Cart-div">
              <button className={`Cart--validate ${cart.length === 0 ? 'disabled' : ''}`} disabled={cart.length === 0}>
                Valider mon panier
              </button>

              {cart.map((item, index) => (
                <div key={index} className="Cart--card">
                  <div className="Cart--items">
                    <div className="Cart--line">
                      <div className="Cart--counter">
                        <span className="Cart--button" onClick={() => increaseQuantity(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                          </svg>
                        </span>
                        <span>{item.quantity}</span>
                        <span className="Cart--button" onClick={() => decreaseQuantity(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M19 13H5V11H19V13Z" />
                          </svg>
                        </span>
                      </div>
                      <span className="Cart--item-name">{item.title}</span>
                      <span className="Cart--amount">{item.price} €</span>
                    </div>
                  </div>
                  <div className="Cart--results">
                    <div className="Cart--result-line">
                      <span className="Cart--result-name">Sous-total</span>
                      <span className="Cart--amount">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="Cart--total ">
                <span className="Cart--result-name-tot">Total</span>
                <span className="Cart--amount-tot">{totalPrice()} €</span>
              </div>

              {cart.length === 0 && (
                <div className="Cart--empty">
                  Remplissez-votre panier
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <footer>
        <div class="footer">
          <div class="link">
            <p>This website was coded by <a href="https://github.com/Riwibou" target="_blank">Riwibou</a></p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
