
import { useEffect, useState } from "react";
import {
  Search,
  User,
  ShoppingBag,
  X,
  Menu,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // FETCH CART COUNT

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/cart/my-cart/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      const totalQuantity =
        data.items?.reduce(
          (total, item) =>
            total + Number(item.quantity || 0),
          0
        ) || 0;

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Cart count error:", error);
      setCartCount(0);
    }
  };

  // CART COUNT UPDATE

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };
  }, []);

  // AUTH STATUS UPDATE

  useEffect(() => {
    const updateAuth = () => {
      setIsLoggedIn(
        !!localStorage.getItem("token")
      );

      fetchCartCount();
    };

    window.addEventListener(
      "authUpdated",
      updateAuth
    );

    return () => {
      window.removeEventListener(
        "authUpdated",
        updateAuth
      );
    };
  }, []);

  // PRODUCT SEARCH

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    navigate(
      `/products?search=${encodeURIComponent(query)}`
    );

    setShowSearch(false);
    setShowMenu(false);
    setSearchText("");
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-icon">V</span>
          <span className="logo-text">VELORA</span>
        </Link>

        {/* DESKTOP LINKS */}

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/products">Shop</Link>
          <Link to="/new-arrivals">
            New Arrivals
          </Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* ACTIONS */}

        <div className="navbar-actions">

          <button
            className="icon-button"
            aria-label="Search"
            type="button"
            onClick={() => {
              setShowSearch(!showSearch);
              setShowMenu(false);
            }}
          >
            {showSearch ? (
              <X size={20} />
            ) : (
              <Search size={20} />
            )}
          </button>

          <Link
            to={isLoggedIn ? "/account" : "/login"}
            className="icon-button navbar-user"
            aria-label={
              isLoggedIn ? "My Account" : "Login"
            }
            onClick={closeMenu}
          >
            <User size={20} />
          </Link>

          <Link
            to="/cart"
            className="icon-button cart-button"
            aria-label="Cart"
            onClick={closeMenu}
          >
            <ShoppingBag size={20} />
            <span className="cart-count">
              {cartCount}
            </span>
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="icon-button mobile-menu-button"
            aria-label={
              showMenu ? "Close menu" : "Open menu"
            }
            aria-expanded={showMenu}
            aria-controls="velora-mobile-menu"
            onClick={() => {
              setShowMenu(!showMenu);
              setShowSearch(false);
            }}
          >
            {showMenu ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE NAVIGATION */}

      {showMenu && (
        <div
          id="velora-mobile-menu"
          className="mobile-nav-menu"
        >
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/products" onClick={closeMenu}>
            Shop
          </Link>

          <Link
            to="/new-arrivals"
            onClick={closeMenu}
          >
            New Arrivals
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link
            to={isLoggedIn ? "/account" : "/login"}
            onClick={closeMenu}
          >
            {isLoggedIn ? "My Account" : "Login"}
          </Link>
        </div>
      )}

      {/* SEARCH BAR */}

      {showSearch && (
        <form
          className="navbar-search-form"
          onSubmit={handleSearch}
          role="search"
        >
          <input
            type="search"
            placeholder="Search VELORA products..."
            aria-label="Search products"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            autoFocus
          />

          <button type="submit">
            <Search size={18} />
            SEARCH
          </button>
        </form>
      )}
    </>
  );
}

export default Navbar;
