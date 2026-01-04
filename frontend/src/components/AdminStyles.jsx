import React from 'react';

const AdminStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
            --primary: #B87333;
            --primary-dark: #A0522D;
            --bg-page: #F8F9FB;
            --bg-card: #FFFFFF;
            --sidebar-bg: #1F2937;
            --text-main: #111827;
            --text-muted: #6B7280;
            --border: #E5E7EB;
            
            /* Status Colors */
            --status-success-bg: #D1FAE5;
            --status-success-text: #065F46;
            --status-warning-bg: #FEF3C7;
            --status-warning-text: #92400E;
            --status-error-bg: #FEE2E2;
            --status-error-text: #991B1B;
            --status-info-bg: #DBEAFE;
            --status-info-text: #1E40AF;

            --radius: 12px;
            --shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-page);
            color: var(--text-main);
            margin: 0;
        }

        /* Layout */
        .admin-layout {
            display: flex;
            min-height: 100vh;
        }

        .admin-sidebar {
            width: 260px;
            background: linear-gradient(180deg, #1F2937 0%, #111827 100%);
            color: white;
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            z-index: 50;
            box-shadow: 4px 0 24px rgba(0,0,0,0.2);
        }

        .admin-main {
            flex: 1;
            margin-left: 260px;
            padding: 2.5rem;
            max-width: 1600px;
        }

        .admin-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
        }

        /* Sidebar Items */
        .sb-brand-container {
            padding: 2rem;
            display: flex;
            justify-content: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 1rem;
        }
        
        .sb-logo {
            max-width: 140px;
            height: auto;
            display: block;
        }

        .sb-nav {
            padding: 0 1rem;
            list-style: none;
            margin: 0;
            flex: 1;
        }

        .sb-item {
            margin-bottom: 0.5rem;
        }

        .sb-link {
            display: flex;
            align-items: center;
            padding: 0.85rem 1.25rem;
            color: #9CA3AF;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s ease;
            font-weight: 500;
            border: 1px solid transparent;
        }

        .sb-link:hover {
            background: rgba(255,255,255,0.05);
            color: white;
            transform: translateX(4px);
        }
        
        .sb-link.active {
            background: linear-gradient(90deg, rgba(184, 115, 51, 0.15) 0%, rgba(184, 115, 51, 0.05) 100%);
            color: var(--primary);
            border: 1px solid rgba(184, 115, 51, 0.2);
            font-weight: 600;
        }

        .sb-icon {
            margin-right: 1rem;
            width: 20px;
            opacity: 0.8;
        }
        .sb-link.active .sb-icon {
            opacity: 1;
            color: var(--primary);
        }

        /* Cards & Stats */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }

        .card {
            background: var(--bg-card);
            border-radius: 16px;
            padding: 1.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(229, 231, 235, 0.5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01);
            border-color: rgba(184, 115, 51, 0.2);
        }
        
        /* Subtle copper top accent for cards */
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary) 0%, #E29E5D 100%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .card:hover::before {
            opacity: 1;
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: 500;
            letter-spacing: 0.01em;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .stat-val {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-main);
            margin-top: 0.5rem;
            letter-spacing: -0.02em;
        }

        /* Modern Table */
        .table-container {
            background: var(--bg-card);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
            border: 1px solid var(--border);
            overflow: hidden;
            transition: box-shadow 0.3s;
        }
        .table-container:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        .data-table th {
            background: #F9FAFB;
            padding: 1.25rem 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            border-bottom: 2px solid #F3F4F6;
        }

        .data-table td {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #F3F4F6;
            font-size: 0.95rem;
            color: var(--text-main);
            vertical-align: middle;
            transition: background 0.2s;
        }
        
        .data-table tr:hover td {
            background: #F8FAFC;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.025em;
        }

        .badge.success { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
        .badge.warning { background: #FEF3C7; color: #9A3412; border: 1px solid #FDE68A; }
        .badge.error { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
        .badge.info { background: #E0F2FE; color: #075985; border: 1px solid #BAE6FD; }

        /* Buttons */
        .btn {
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.2s;
        }

        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-dark); }
        
        .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
        
        .btn-icon {
            background: transparent;
            color: var(--text-muted);
            padding: 4px;
        }
        .btn-icon:hover { color: var(--primary); background: #F3F4F6; }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: var(--radius);
            width: 100%;
            max-width: 500px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

    `}</style>
);

export default AdminStyles;
