'use client'

import React, { useState } from 'react'
import './page.css'

export default function AdminPage() {
    const [gridBuy, setGridBuy] = useState('8.5')
    const [gridSell, setGridSell] = useState('3.5')

    function saveSettings(e: React.FormEvent) {
        e.preventDefault()
        // replace with real save logic (API call / context update)
        console.log('Saved', { gridBuy, gridSell })
        alert('Settings saved')
    }

    return (
        <div className="orch-root">
            <header className="orch-header">
                <div className="brand">
                    <span className="logo">⚡</span>
                    <h1>Orchestration Hub</h1>
                </div>

                <nav className="orch-nav">
                    <a className="nav-item">Overview</a>
                    <a className="nav-item">Management</a>
                    <a className="nav-item">Analytics</a>
                    <a className="nav-item">Alerts &amp; Logs</a>
                    <a className="nav-item">Automation</a>
                    <a className="nav-item active">Settings</a>
                </nav>

                <div className="header-right">
                    <div className="last-updated">Last updated: 10:01:42 PM</div>
                    <div className="user">Admin</div>
                    <button className="switch-btn">Switch to Consumer View</button>
                </div>
            </header>

            <main className="orch-main">
                <div className="settings-wrapper">
                    <form className="settings-card" onSubmit={saveSettings}>
                        <h2 className="card-title">Financial Settings</h2>

                        <label className="field-label">Grid Buy Rate (₹/kWh)</label>
                        <input
                            className="field-input"
                            value={gridBuy}
                            onChange={(e) => setGridBuy(e.target.value)}
                            type="number"
                            step="0.1"
                        />

                        <label className="field-label">Grid Sell/Export Rate (₹/kWh)</label>
                        <input
                            className="field-input"
                            value={gridSell}
                            onChange={(e) => setGridSell(e.target.value)}
                            type="number"
                            step="0.1"
                        />

                        <div className="actions">
                            <button type="submit" className="save-btn">Save Settings</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}