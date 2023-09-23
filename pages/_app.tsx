import '../app/globals.css';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { store } from '../store/store';
import { Roboto } from 'next/font/google'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <main className={roboto.className}>
                <Component {...pageProps} />
            </main>
        </Provider>
    )
}