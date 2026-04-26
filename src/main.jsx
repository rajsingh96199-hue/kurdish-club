import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import emailjs from "@emailjs/browser";
import {
  Coffee,
  CupSoda,
  Dessert,
  Flame,
  Instagram,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./styles.css";

const ORDER_EMAIL = import.meta.env.VITE_ORDER_EMAIL;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const menuSections = [
  {
    category: "Milkshakes",
    icon: CupSoda,
    note: "Hand-spun, chilled and finished like dessert.",
    items: [
      ["Oreo Milkshake", 4],
      ["Aero Milkshake", 4],
      ["Banana Milkshake", 4],
      ["Strawberry Milkshake", 4],
      ["Vanilla Milkshake", 4],
      ["Chocolate Milkshake", 4],
    ],
  },
  {
    category: "Tea",
    icon: Coffee,
    note: "Slow lounge service with aromatic leaves.",
    items: [
      ["Kurdish Tea", 2],
      ["Green Tea", 2],
      ["Mint Tea", 2],
      ["Ginger Tea", 2.5],
      ["Pot of Tea", 5],
    ],
  },
  {
    category: "Coffee",
    icon: Coffee,
    note: "Classic cafe pours with a polished finish.",
    items: [
      ["Espresso", 3],
      ["Americano", 3],
      ["Cappuccino", 3],
      ["Latte", 3],
      ["Mocha", 3.5],
      ["Ice Latte", 4],
      ["Extra Syrup", 0.5],
    ],
  },
  {
    category: "Desserts",
    icon: Dessert,
    note: "Rich cakes, warm plates and late-night sweets.",
    items: [
      ["Fudge Cake", 5],
      ["Lotus Cheesecake", 5],
      ["Oreo Cheesecake", 5],
      ["Baklava with Ice Cream", 5],
      ["Waffle Sticks", 7],
      ["Cookie Dough", 7],
    ],
  },
  {
    category: "Soft Drinks",
    icon: CupSoda,
    note: "Cold classics for the table.",
    items: [
      ["Coca-Cola", 2],
      ["Pepsi", 2],
      ["7UP", 2],
      ["Fanta", 2],
      ["Red Bull", 3],
      ["Water", 2],
    ],
  },
  {
    category: "Al Fakher",
    icon: Flame,
    note: "Premium shisha flavours served lounge-style.",
    items: [
      ["Double Apple", 13],
      ["Grape Mint", 13],
      ["Lemon", 13],
      ["Watermelon", 13],
      ["Peach", 13],
      ["Orange", 13],
      ["Pomegranate", 13],
      ["Kiwi", 13],
      ["Spearmint Gum", 13],
      ["Sweet Melon", 13],
      ["Blueberry", 13],
      ["Vanilla", 13],
      ["Coconut", 13],
      ["Strawberry", 13],
    ],
  },
];

const featured = [
  {
    title: "Signature Milkshakes",
    body: "Velvet-smooth pours with whipped peaks, chocolate ribbons and fruit finishes.",
    image: "/images/Al faker 3.jpeg",
  },
  {
    title: "Dessert Lounge Plates",
    body: "Fudge, cheesecake, baklava and warm sweets for relaxed tables and late nights.",
    image: "/images/Al faker 2.jpeg",
  },
  {
    title: "Al Fakher Shisha",
    body: "Fruit-led flavour profiles, glowing coals and a room made for slow conversation.",
    image: "/images/Al faker shisha.jpeg",
  },
];

const formatPrice = (price) => `£${price.toFixed(2)}`;

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useReveal();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (name, price, category) => {
    setCart((current) => {
      const existing = current.find((item) => item.name === name);
      if (existing) {
        return current.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { name, price, category, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const changeQuantity = (name, delta) => {
    setCart((current) =>
      current
        .map((item) =>
          item.name === name
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (name) => {
    setCart((current) => current.filter((item) => item.name !== name));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <main>
        <Hero onOrder={() => document.getElementById("menu").scrollIntoView()} />
        <MenuSection addToCart={addToCart} />
        <FeaturedSection />
        <OrderSection
          cart={cart}
          total={total}
          setCart={setCart}
          changeQuantity={changeQuantity}
          removeItem={removeItem}
          submitting={submitting}
          setSubmitting={setSubmitting}
          setConfirmation={setConfirmation}
        />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        total={total}
        onClose={() => setCartOpen(false)}
        changeQuantity={changeQuantity}
        removeItem={removeItem}
      />
      {confirmation && (
        <div className="toast" role="status" onClick={() => setConfirmation("")}>
          <Sparkles size={18} />
          {confirmation}
        </div>
      )}
    </>
  );
}

function Header({ cartCount, onCart }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label="Kurdish Social Club home">
        <span>KSC</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#menu">Menu</a>
        <a href="#featured">Featured</a>
        <a href="#order">Order</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="icon-button cart-button" type="button" onClick={onCart} aria-label="Open cart">
        <ShoppingBag size={20} />
        {cartCount > 0 && <span>{cartCount}</span>}
      </button>
    </header>
  );
}

function Hero({ onOrder }) {
  return (
    <section className="hero" id="top">
      <div className="smoke smoke-one" />
      <div className="smoke smoke-two" />
      <div className="hero-art" aria-hidden="true" />
      <div className="hero-content" data-reveal>
        <div className="crest">KSC</div>
        <p className="eyebrow">Luxury lounge cafe</p>
        <h1>Kurdish Social Club</h1>
        <p className="subtitle">Coffee • Tea • Desserts • Shisha</p>
        <div className="hero-actions">
          <button className="gold-button" type="button" onClick={onOrder}>
            Order Now
          </button>
          <a className="ghost-button" href="#featured">
            Explore Lounge
          </a>
        </div>
      </div>
      <div className="hero-card" data-reveal>
        <img src="/images/Landing 2.jpeg" alt="Kurdish Social Club luxury menu artwork" />
      </div>
    </section>
  );
}

function MenuSection({ addToCart }) {
  return (
    <section className="section menu-section" id="menu">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Curated menu</p>
        <h2>Premium lounge favourites</h2>
      </div>
      <div className="menu-grid">
        {menuSections.map(({ category, icon: Icon, note, items }) => (
          <article className="menu-card" key={category} data-reveal>
            <div className="menu-card-head">
              <Icon size={28} />
              <div>
                <h3>{category}</h3>
                <p>{note}</p>
              </div>
            </div>
            <div className="menu-items">
              {items.map(([name, price]) => (
                <div className="menu-item" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>{formatPrice(price)}</span>
                  </div>
                  <button type="button" onClick={() => addToCart(name, price, category)}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection() {
  return (
    <section className="section featured-section" id="featured">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">House signatures</p>
        <h2>Milkshakes, desserts and shisha with theatre</h2>
      </div>
      <div className="featured-track">
        {featured.map((item) => (
          <article className="feature-panel" key={item.title} data-reveal>
            <img src={item.image} alt={item.title} />
            <div>
              <span>Featured</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrderSection({
  cart,
  total,
  setCart,
  changeQuantity,
  removeItem,
  submitting,
  setSubmitting,
  setConfirmation,
}) {
  const orderDetails = cart
    .map((item) => `${item.quantity} x ${item.name} - ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  const placeOrder = async (event) => {
  event.preventDefault();

  if (!cart.length) {
    return setConfirmation("Please add items to your cart first");
  }

  const formData = new FormData(event.currentTarget);

  const customerName = formData.get("name");
  const customerPhone = formData.get("phone");
  const customerEmail = formData.get("email");

  const message = `
New Order - Kurdish Social Club

Name: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}

Order:
${orderDetails}

Total: ${formatPrice(total)}
`;

  const payload = {
    to_email: ORDER_EMAIL,
    customer_name: customerName,
    phone: customerPhone,
    email: customerEmail,
    order_details: message,
    total: formatPrice(total),
  };

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  setSubmitting(true);

  try {
    if (serviceId && templateId && publicKey) {
      await emailjs.send(serviceId, templateId, payload, { publicKey });
    } else {
      console.info("EmailJS is not configured. Payload prepared:", payload);
    }

    window.open(whatsappUrl, "_blank");

    setConfirmation("Order placed successfully");
    setCart([]);
    event.currentTarget.reset();
  } catch (error) {
    console.error(error);

    window.open(whatsappUrl, "_blank");

    setConfirmation("Order sent to WhatsApp. Email delivery needs checking.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <section className="section order-section" id="order">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Checkout</p>
        <h2>Your private table order</h2>
      </div>
      <div className="order-layout" data-reveal>
        <CartSummary cart={cart} total={total} changeQuantity={changeQuantity} removeItem={removeItem} />
        <form className="checkout-form" onSubmit={placeOrder}>
          <label>
            Name
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label>
            Phone Number
            <input name="phone" type="tel" placeholder="8657466854" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Order Details
            <textarea name="order" value={orderDetails || "Your selected items will appear here"} readOnly />
          </label>
          <button className="gold-button" type="submit" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </section>
  );
}

function CartSummary({ cart, total, changeQuantity, removeItem }) {
  return (
    <aside className="cart-summary">
      <h3>Cart Page</h3>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is waiting for something excellent.</p>
      ) : (
        <div className="cart-lines">
          {cart.map((item) => (
            <div className="cart-line" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{formatPrice(item.price)} each</span>
              </div>
              <div className="quantity-control">
                <button type="button" aria-label={`Reduce ${item.name}`} onClick={() => changeQuantity(item.name, -1)}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.name}`} onClick={() => changeQuantity(item.name, 1)}>
                  <Plus size={14} />
                </button>
                <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.name)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
    </aside>
  );
}

function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-content" data-reveal>
        <p className="eyebrow">Visit and connect</p>
        <h2>Reserve the evening mood</h2>
        <div className="contact-actions">
          <a href="tel:8657466854">
            <Phone size={20} />
            8657466854
          </a>
          <a href={`mailto:${ORDER_EMAIL}`}>
            <Mail size={20} />
            {ORDER_EMAIL}
          </a>
          <a href="https://maps.google.com/?q=Kurdish%20Social%20Club" target="_blank" rel="noreferrer">
            <MapPin size={20} />
            Map
          </a>
        </div>
      </div>
      <div className="map-panel" data-reveal>
        <img src="/images/Landing 2.jpeg" alt="Kurdish Social Club black and gold menu board" />
      </div>
    </section>
  );
}

function CartDrawer({ open, cart, total, onClose, changeQuantity, removeItem }) {
  return (
    <div className={`drawer-shell ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="drawer-backdrop" type="button" onClick={onClose} aria-label="Close cart" />
      <aside className="drawer" aria-label="Cart">
        <div className="drawer-head">
          <h2>Your Order</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <CartSummary cart={cart} total={total} changeQuantity={changeQuantity} removeItem={removeItem} />
        <a className="gold-button drawer-checkout" href="#order" onClick={onClose}>
          Checkout
        </a>
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-brand">Kurdish Social Club</div>
      <p>Good Food, Good Drinks, Good Company</p>
      <div className="socials" aria-label="Social links">
        <a href="#top" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="tel:8657466854" aria-label="Phone">
          <Phone size={20} />
        </a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);