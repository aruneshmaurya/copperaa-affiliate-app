import React from 'react';

const DashboardStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
            --primary-copper: #B87333;
            --primary-copper-dark: #A0522D;
            --secondary-bg: #F8F9FB;
            --white: #FFFFFF;
            --text-dark: #1F2937;
            --text-gray: #6B7280;
            --border-light: #E5E7EB;
            --success-green: #10B981;
            --pending-orange: #F59E0B;
            --error-red: #EF4444;
            --radius-md: 12px;
            --radius-lg: 16px;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            --transition: all 0.2s ease;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background-color: var(--secondary-bg);
            color: var(--text-dark);
            margin: 0;
            padding: 0;
        }

        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }

        /* Top Navbar */
        .navbar {
            background: var(--white);
            height: 70px;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: var(--shadow-sm);
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .navbar-brand {
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--primary-copper);
            letter-spacing: -0.5px;
        }

        .navbar-user {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-greeting {
            color: var(--text-dark);
            font-weight: 500;
        }

        .btn-logout {
            background: transparent;
            border: 1px solid var(--border-light);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            color: var(--text-gray);
            font-size: 0.875rem;
            cursor: pointer;
            transition: var(--transition);
        }

        .btn-logout:hover {
            border-color: var(--primary-copper);
            color: var(--primary-copper);
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: var(--white);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
            border: 1px solid transparent; /* Prepare for hover border */
            transition: var(--transition);
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--border-light);
        }

        .stat-label {
            font-size: 0.875rem;
            color: var(--text-gray);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-dark);
            margin: 0;
            line-height: 1.2;
        }
        
        .stat-value.copper-text {
            color: var(--primary-copper);
        }

        /* Section Cards (Referral & Payment) */
        .card {
            background: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .card-header {
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-light);
            padding-bottom: 1rem;
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-dark);
            margin: 0;
        }
        
        .card-subtitle {
            margin: 0.25rem 0 0 0;
            font-size: 0.875rem;
            color: var(--text-gray);
        }

        /* Utility Classes */
        .grid-2-col {
            grid-template-columns: 1fr 1fr;
        }
        
        .col-span-2 {
            grid-column: span 2;
        }

        .col-span-2 {
            grid-column: span 2;
        }

        .referral-actions-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
        }

        /* Forms & Inputs */
        .form-group {
            margin-bottom: 1.25rem;
        }

        .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-light);
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            color: var(--text-dark);
            transition: var(--transition);
            box-sizing: border-box; /* Important for width: 100% */
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-copper);
            box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.1);
        }
        
        .form-control-readonly {
            background-color: #F3F4F6;
            color: var(--text-gray);
            cursor: default;
        }

        .input-group {
            display: flex;
            gap: 0.75rem;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-md);
            font-weight: 500;
            font-size: 0.95rem;
            cursor: pointer;
            transition: var(--transition);
            border: none;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--primary-copper);
            color: var(--white);
        }

        .btn-primary:hover {
            background: var(--primary-copper-dark);
            box-shadow: 0 4px 12px rgba(184, 115, 51, 0.2);
        }

        .btn-copy {
            background: var(--text-dark);
            color: var(--white);
            flex-shrink: 0;
        }
        
        .btn-copy:hover {
            background: #000;
        }

        /* Table */
        .table-container {
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-light);
            overflow: hidden; /* For rounded corners */
            background: var(--white);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #F9FAFB;
            text-align: left;
            padding: 1rem 1.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: var(--text-gray);
            letter-spacing: 0.5px;
            border-bottom: 1px solid var(--border-light);
        }

        td {
            padding: 1rem 1.5rem;
            color: var(--text-dark);
            font-size: 0.9rem;
            border-bottom: 1px solid var(--border-light);
        }

        tr:last-child td {
            border-bottom: none;
        }
        
        tr:hover td {
            background-color: #FAFAFA;
        }

        /* Status Badges */
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-paid {
            background: #D1FAE5;
            color: #065F46;
        }
        
        .badge-approved {
            background: #D1FAE5;
            color: #065F46;
        }

        .badge-pending {
            background: #FEF3C7;
            color: #92400E;
        }
        
        .badge-unpaid {
            background: #FEF3C7;
            color: #92400E;
        }

        .badge-cancelled, .badge-reversed {
            background: #FEE2E2;
            color: #991B1B;
        }

        /* Loading */
        .loading-screen {
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
            color: var(--primary-copper);
            font-size: 1.25rem;
            font-weight: 500;
        }

        /* Auth Pages */
        .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background: var(--secondary-bg);
        }
        
        .auth-card {
            background: var(--white);
            width: 100%;
            max-width: 440px;
            padding: 3rem 2.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            text-align: center;
            border: 1px solid var(--border-light);
        }
        
        .auth-logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 2rem;
        }
        
        .auth-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-dark);
        }
        
        .auth-subtitle {
            color: var(--text-gray);
            font-size: 0.95rem;
            margin-bottom: 2rem;
        }
        
        .auth-footer {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: var(--text-gray);
        }
        
        .auth-link {
            color: var(--primary-copper);
            text-decoration: none;
            font-weight: 500;
        }
        
        .auth-link:hover {
            text-decoration: underline;
        }
        
        /* Navbar Logo */
        .navbar-brand-img {
            height: 32px;
            width: auto;
        }

        /* Responsive Dashboard Styles */
        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: 1fr 1fr; /* 2x2 on Tablet */
            }
        }

        @media (max-width: 768px) {
            .navbar {
                padding: 0 1rem;
                height: 60px;
            }
            .dashboard-container {
                padding: 1rem;
                padding-bottom: 5rem; /* Space for bottom nav */
            }
            .stats-grid {
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            .stat-card {
                padding: 1rem;
            }
            .stat-value {
                font-size: 1.5rem;
            }
            
            /* Stack Input Groups (Referral Link) */
            .input-group {
                flex-direction: column;
                gap: 1rem;
            }
            .btn-copy {
                width: 100%;
                position: sticky;
                bottom: 1rem; /* Sticky support if container allows */
                z-index: 10;
            }
            
            /* Forms one column */
            .form-row, .grid-2-col, .referral-actions-grid {
                grid-template-columns: 1fr;
            }
            .col-span-2 {
                grid-column: auto; /* Reset span on mobile */
            }
            
            /* Cards */
            .card {
                padding: 1.25rem;
            }
        }
        
        @media (max-width: 480px) {
            .stats-grid {
                grid-template-columns: 1fr; /* 1 col on Mobile */
            }
            .navbar-brand {
                font-size: 1.1rem;
            }
            .user-greeting {
                display: none; /* Hide greeting on mobile */
            }
            .navbar-user {
                gap: 0.5rem;
            } 
        }
    `}</style>
);

export default DashboardStyles;
