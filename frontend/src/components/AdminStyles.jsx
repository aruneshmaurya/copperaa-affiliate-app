import React from 'react';

const AdminStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
            --primary: #B87333;
            --primary-gradient: linear-gradient(135deg, #C88A4A 0%, #A8652A 100%);
            --bg-body: #F8F9FB;
            --bg-card: #FFFFFF;
            --text-main: #1F2937;
            --text-muted: #6B7280;
            
            /* Modern Variables */
            --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 15px -3px rgba(0, 0, 0, 0.04);
            --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01);
            --radius-default: 16px;

            /* Legacy Status Colors */
            --status-success-bg: #D1FAE5;
            --status-success-text: #065F46;
            --status-warning-bg: #FEF3C7;
            --status-warning-text: #92400E;
            --status-error-bg: #FEE2E2;
            --status-error-text: #991B1B;
            --status-info-bg: #DBEAFE;
            --status-info-text: #1E40AF;
        }

        * {
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg-body);
            color: var(--text-main);
            font-family: 'Poppins', sans-serif;
            -webkit-font-smoothing: antialiased;
            margin: 0;
        }

        /* Layout */
        .admin-layout {
            display: flex;
            min-height: 100vh;
        }

        .admin-sidebar {
            width: 280px;
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
            padding-bottom: 2rem;
        }

        .admin-main {
            flex: 1;
            margin-left: 280px;
            padding: 2rem; /* Reduced from 3rem */
            width: calc(100% - 280px);
            color: var(--text-main);
        }

        .admin-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem; /* Reduced from 3rem */
        }

        /* Sidebar Items */
        .sb-brand-container {
            padding: 2.5rem 2rem;
            display: flex;
            justify-content: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 1.5rem;
        }
        
        .sb-logo {
            max-width: 160px;
            height: auto;
            display: block;
        }

        .sb-nav {
            padding: 0 1.5rem;
            list-style: none;
            margin: 0;
            flex: 1;
        }

        .sb-item {
            margin-bottom: 0.75rem;
        }

        .sb-link {
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem;
            color: #9CA3AF;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s ease;
            font-weight: 500;
            border: 1px solid transparent;
            font-size: 0.95rem;
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .sb-icon {
            margin-right: 1rem;
            width: 20px;
            opacity: 0.8;
            display: flex;
            align-items: center;
        }
        .sb-link.active .sb-icon {
            opacity: 1;
            color: var(--primary);
        }

        /* Cards & Stats */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 3rem;
        }

        .card {
            background: var(--bg-card);
            color: var(--text-main); /* Explicitly set color */
            border-radius: var(--radius-default);
            padding: 2rem;
            box-shadow: var(--shadow-card);
            border: 1px solid rgba(229, 231, 235, 0.5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-hover);
            border-color: rgba(184, 115, 51, 0.2);
        }
        
        /* Subtle copper top accent for cards */
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary-gradient);
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
            text-transform: uppercase;
        }

        .stat-val {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-main);
            margin-top: 1rem;
            letter-spacing: -0.02em;
            line-height: 1.1;
        }

        /* Modern Table */
        .table-container {
            background: var(--bg-card);
            border-radius: var(--radius-default);
            box-shadow: var(--shadow-card);
            border: 1px solid rgba(229, 231, 235, 0.5);
            overflow: hidden;
            transition: box-shadow 0.3s;
        }
        .table-container:hover {
            box-shadow: var(--shadow-hover);
        }

        .data-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            text-align: left;
        }

        .data-table th {
            background: #F9FAFB;
            padding: 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            border-bottom: 2px solid #F3F4F6;
        }

        .data-table td {
            padding: 1.5rem;
            border-bottom: 1px solid #F3F4F6;
            font-size: 0.95rem;
            color: #1F2937;
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
            padding: 0.4rem 1rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.025em;
            text-transform: uppercase;
        }

        .badge.success { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
        .badge.warning { background: #FEF3C7; color: #9A3412; border: 1px solid #FDE68A; }
        .badge.error { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
        .badge.info { background: #E0F2FE; color: #075985; border: 1px solid #BAE6FD; }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid transparent;
            text-decoration: none;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--primary-gradient);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(184, 115, 51, 0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-primary:hover {
            box-shadow: 0 10px 15px -3px rgba(184, 115, 51, 0.4);
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        .btn-secondary {
            background: white;
            color: var(--text-main);
            border: 1px solid #E5E7EB;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .btn-secondary:hover {
            background: #F9FAFB;
            border-color: #D1D5DB;
        }

        .btn-sm {
            padding: 0.4rem 0.85rem;
            font-size: 0.8rem;
        }
        
        .btn-icon {
            background: transparent;
            color: var(--text-muted);
            padding: 4px;
        }
        .btn-icon:hover { color: var(--primary); background: #F3F4F6; }

        /* Inputs */
        .form-control {
            width: 100%;
            padding: 0.85rem 1rem;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            font-size: 0.95rem;
            transition: all 0.2s;
            background: #F9FAFB;
        }
        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.1);
        }
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }

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
            border-radius: var(--radius-default);
            width: 100%;
            max-width: 500px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        }


        /* Responsive Layout */
        @media (max-width: 1024px) {
            .admin-sidebar {
                width: 80px;
            }
            .admin-main {
                margin-left: 80px;
                width: calc(100% - 80px);
                padding: 1.5rem;
            }
            .sb-brand-container {
                padding: 1.5rem 0.5rem;
            }
            .sb-logo {
                display: none; /* Hide full logo */
            }
            .sb-brand-container::after {
                content: 'C'; /* Initials or Icon */
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--primary);
            }
            .sb-link {
                justify-content: center;
                padding: 1rem 0.5rem;
            }
            .sb-icon {
                margin-right: 0;
            }
            .sb-link span:not(.sb-icon), .sb-item button span:not(.sb-icon) {
                 /* Text inside link */
                 display: none;
            }
             /* Specifically target the text node if it's not wrapped in span, 
                current structure is <span class="sb-icon"></span> Text 
                so we might need to rely on the fact that only icon is visible
             */
             .sb-link {
                 font-size: 0; /* Hide text */
             }
             .sb-icon {
                 margin: 0;
             }
        }

        @media (max-width: 768px) {
            .admin-sidebar {
                display: none; /* Hide sidebar completely on mobile */
            }
            .admin-main {
                margin-left: 0;
                width: 100%;
                padding: 1rem;
                padding-bottom: 80px; /* Space for bottom nav */
            }
            .admin-topbar {
                margin-bottom: 1.5rem;
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
            .stat-grid {
                grid-template-columns: 1fr 1fr; /* 2 cols on mobile */
                gap: 1rem;
            }
            
            /* Mobile Table Card View */
            .data-table thead {
                display: none;
            }
            .data-table, .data-table tbody, .data-table tr, .data-table td {
                display: block;
                width: 100%;
            }
            .data-table tr {
                margin-bottom: 1rem;
                background: white;
                border: 1px solid #E5E7EB;
                border-radius: 12px;
                padding: 1rem;
            }
            .data-table td {
                padding: 0.5rem 0;
                border-bottom: 1px solid #F3F4F6;
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: right;
            }
            .data-table td::before {
                content: attr(data-label);
                font-weight: 600;
                color: var(--text-muted);
                font-size: 0.85rem;
                text-transform: uppercase;
                margin-right: 1rem;
            }
            .data-table td:last-child {
                border-bottom: none;
            }
        }

        @media (max-width: 480px) {
            .stat-grid {
                grid-template-columns: 1fr; /* 1 col on very small screens */
            }
            .admin-topbar h2 {
                font-size: 1.25rem;
            }
        }

        /* Bottom Nav (Mobile Only) */
        .bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #E5E7EB;
            padding: 0.75rem 1rem;
            justify-content: space-around;
            z-index: 999; /* High z-index */
            box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.05);
        }
        
        @media (max-width: 768px) {
            .bottom-nav {
                display: flex;
            }
        }

        .bn-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: var(--text-muted);
            font-size: 0.75rem;
            gap: 4px;
        }
        
        .bn-item.active {
            color: var(--primary);
            font-weight: 600;
        }
        
        .bn-icon {
            width: 24px;
            height: 24px;
        }
    `}</style>
);

export default AdminStyles;
