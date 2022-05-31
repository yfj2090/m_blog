// import App from 'next/app'
import { Provider } from 'react-redux'
import { wrapper } from '../store'

function MyApp(props) {
    const {
      Component,
      pageProps,
      router,
    } = props

    return <Component {...pageProps} router={router}/>
}

// App.getInitialProps = async (ctx) => {
//     const { Component } = ctx
//     console.log('app init')

//     let pageProps = {}
//     if (Component.getInitialProps) {
//       pageProps = await Component.getInitialProps(ctx)
//     }
//     return {
//       pageProps,
//     }
//   }

export default wrapper.withRedux(MyApp)
