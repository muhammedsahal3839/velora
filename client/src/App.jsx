
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./pages/Orders/Orders";
import Account from "./pages/Account/Account";

import HelpButton from "./components/HelpButton/HelpButton";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />

        <Route
          path="/new-arrivals"
          element={<Products newArrivals={true} />}
        />

        <Route
          path="/men"
          element={<Products category="Men" />}
        />

        <Route
          path="/women"
          element={<Products category="Women" />}
        />

        <Route
          path="/footwear"
          element={<Products category="Footwear" />}
        />

        <Route
          path="/accessories"
          element={<Products category="Accessories" />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      <HelpButton />
    </>
  );
}

export default App;
