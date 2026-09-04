import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderHistoryProvider } from "@/context/OrderHistoryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import WorldOfTubhyam from "./pages/WorldOfTubhyam";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import SizeGuide from "./pages/SizeGuide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import VideoCall from "./pages/VideoCall";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Lookbook from "./pages/Lookbook";
import Collections from "./pages/Collections";
import InstagramGallery from "./pages/InstagramGallery";
import Wishlist from "./pages/Wishlist";
import AdminOrders from "./pages/AdminOrders";
import BlogDetail from "./pages/BlogDetail";
import TrackOrder from "./pages/TrackOrder";
import Orders from "./pages/Orders";
import TryOn from "./pages/TryOn";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import AIChatWidget from "./components/AIChatWidget";
import CartSidebar from "./components/CartSidebar";
import AddToBagSheet from "./components/AddToBagSheet";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <WishlistProvider>
          <OrderHistoryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/world-of-tubhyam" element={<WorldOfTubhyam />} />
              <Route path="/shop" element={<Products />} />
              <Route path="/products" element={<Navigate to="/shop" replace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/instagram" element={<InstagramGallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/video-call" element={<VideoCall />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* Admin Routes */}
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/try-on" element={<TryOn />} />
              <Route path="/store" element={<Store />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CartSidebar />
            <AddToBagSheet />
          </BrowserRouter>
          <AIChatWidget />
          </OrderHistoryProvider>
          </WishlistProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ThemeProvider>
);

export default App;
