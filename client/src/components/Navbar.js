import React from 'react'

const Navbar = () => {
  return (
    <nav>
        <div className="logo">
            <h2>Transfer System</h2>
        </div>
        <ul className="navLinks">
            <li>ユーザー情報</li>
            <li>交換</li>
            <li>Etherscan</li>
            <li>ウォレット</li>
        </ul>
        <button>ログイン</button>
    </nav>
  )
}

export default Navbar