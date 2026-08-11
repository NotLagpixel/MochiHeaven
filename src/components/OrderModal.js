import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useContent } from "../context/ContentContext";

export default function OrderModal({ open, onClose }) {
  const { content } = useContent();
  const site = content.site;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="order-modal"
        >
          <div className="modal-bg" onClick={onClose} />
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close" data-testid="order-modal-close">
              <X size={26} />
            </button>
            <div className="modal-emoji">🧋🍩</div>
            <p className="eyebrow">ORDER ONLINE</p>
            <h2>Ordering coming soon!</h2>
            <p className="modal-copy">
              Online ordering isn’t connected yet. Add your ordering link (UberEats, DoorDash,
              your own store, etc.) from the private admin panel and this button will send
              customers straight there.
            </p>
            <div className="modal-fav">
              <span>★ CUSTOMER FAVORITE</span>
              <strong>{site.customerFavorite}</strong>
            </div>
            <button className="order-pill big" onClick={onClose} data-testid="order-modal-ok">
              Got it <ShoppingBag size={16} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
