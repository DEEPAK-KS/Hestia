import React from 'react'
import Header from '../Common/Header'
import FooterEnd from '../Common/FooterEnd'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <>
    {/*Header*/}
    <Header/>
    {/*Main*/}
    <main>
      <Outlet/>
    </main>
    {/*Footer*/}
    <FooterEnd/>


    </>
  )
}

export default UserLayout