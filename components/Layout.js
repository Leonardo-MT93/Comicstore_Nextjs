import React from 'react'
import { Header } from './Header'
import Footer from './Footer'

const Layout = ({children}) => {
  return (
    <>
        <Header></Header>
        <main className='max-w-xl m-auto' >
            {children}
        </main>

        <Footer></Footer>
    </>
  )
}

export default Layout