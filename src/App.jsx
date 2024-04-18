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
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
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
      }).filter(Boolean)
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
            <p>{data.restaurant.description}</p>
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
                              <h3>{meal.title}</h3>
                              <p className="description">{meal.description}</p>
                              <span>{meal.price} €</span>
                              {meal.popular && <span>Populaire</span>}
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
          <section className="col-right">
            <h2>Cart</h2>
            <div>
              {cart.map((item, index) => (
                <div key={index}>
                  <p>{item.title}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price} €</p>
                  <p>Total: {(item.price * item.quantity).toFixed(2)} €</p>
                  <button onClick={() => increaseQuantity(item)}>+</button>
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                </div>
              ))}
              <p>Total Price: {totalPrice()} €</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
