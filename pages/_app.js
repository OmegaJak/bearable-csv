import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  return (
    // https://colinhacks.com/essays/building-a-spa-with-nextjs
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </div>
  )
}

export default MyApp;
