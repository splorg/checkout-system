import { useLocation, useRoutes } from "react-router-dom";
import { DefaultLayout } from "./layout/default";
import { Home } from "./pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Event } from "./pages/event";
import { Cart } from "./pages/cart";
import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import { Wallet } from "./pages/wallet";
import { Modal } from "./components/modal";

const queryClient = new QueryClient()

function App() {
  const element = useRoutes([
    { element: <DefaultLayout />, children: [
      { path: "/", element: <Home />, index: true },
      { path: "/events/:eventId", element: <Event /> },
      { path: "/cart", element: <Cart /> },
      { path: "/wallet", element: <Wallet /> },
    ] }
  ])

  const location = useLocation()

  if (!element) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait" initial={false}>
        {cloneElement(element, { key: location.pathname })}
      </AnimatePresence>
      <Modal />
    </QueryClientProvider>
  )
}

export default App
