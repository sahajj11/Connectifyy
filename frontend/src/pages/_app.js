import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  return ( // Added return statement
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
