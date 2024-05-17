import "@/styles/globals.scss";
import { Provider } from "react-redux";
import store from "@/redux/configureStore";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
