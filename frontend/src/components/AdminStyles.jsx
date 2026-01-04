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
            background: var(--sidebar-bg);
            color: white;
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            z-index: 50;
        }

        .admin-main {
            flex: 1;
            margin-left: 260px;
            padding: 2rem;
            max-width: 1600px;
        }

        .admin-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        /* Sidebar Items */
        .sb-brand {
            font-size: 1.5rem;
            font-weight: 700;
            padding: 1.5rem 2rem;
            color: var(--primary);
            letter-spacing: -0.5px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sb-nav {
            padding: 1rem;
            list-style: none;
            margin: 0;
        }

        .sb-item {
            margin-bottom: 0.5rem;
        }

        .sb-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1rem;
            color: #9CA3AF;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s;
            font-weight: 500;
        }

        .sb-link:hover, .sb-link.active {
            background: rgba(255,255,255,0.1);
            color: white;
        }

        .sb-icon {
            margin-right: 0.75rem;
            width: 20px;
        }

        /* Cards & Stats */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .card {
            background: var(--bg-card);
            border-radius: var(--radius);
            padding: 1.5rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        .stat-val {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-main);
            margin-top: 0.25rem;
        }

        /* Modern Table */
        .table-container {
            background: var(--bg-card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
            overflow: hidden;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        .data-table th {
            background: #F9FAFB;
            padding: 1rem 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border);
        }

        .data-table td {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.9rem;
            color: var(--text-main);
            vertical-align: middle;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .data-table tr:hover {
            background: #F9FAFB;
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge.success { background: var(--status-success-bg); color: var(--status-success-text); }
        .badge.warning { background: var(--status-warning-bg); color: var(--status-warning-text); }
        .badge.error { background: var(--status-error-bg); color: var(--status-error-text); }
        .badge.info { background: var(--status-info-bg); color: var(--status-info-text); }

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
