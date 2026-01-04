const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Affiliate = require('./models/Affiliate');

// Hardcoded URI from user's previous input to ensure it connects to the right DB
const MONGO_URI = "mongodb+srv://imaruneshmaurya_db_user:V6mu48hgc%40arun@cluster0.e2vpxxn.mongodb.net/copperaa_affiliate?retryWrites=true&w=majority&appName=Cluster0";

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@copperaa.com';
        const adminPassword = 'admin123';

        // Check if admin exists
        const userExists = await Affiliate.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists!');
            console.log('Email:', adminEmail);
            // We can't show the password because it is hashed, but we can tell them to use the default if they just created it, or update it.
            // Let's force update the password to be sure.
            userExists.password = adminPassword;
            userExists.role = 'admin';
            userExists.approved = true;
            await userExists.save();
            console.log('Admin password reset to: admin123');
        } else {
            const admin = await Affiliate.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                affiliateCode: 'ADMIN001',
                approved: true
            });
            console.log('Admin User Created Successfully!');
            console.log('Email:', admin.email);
            console.log('Password:', adminPassword);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
