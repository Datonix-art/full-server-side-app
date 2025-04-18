import { hashPassword } from '../utils/hash.util.js';
import db from '../database/db.js';

// admin creation
function createAdmin() { // node ./scripts/createAdmin.script.js
    db.get(`SELECT * FROM users WHERE role = 'admin'`, [], async (err, row) => {
        if(err) {
            console.error(`Error: ${err.message}`);
            return;
        }
        if(row) {
            console.log('Admin user already exists.');
            return;
        }
        const adminUser = {
            email: 'adminExample@gmail.com',
            username: 'admin', 
            password: 'admin123',
            role: 'admin'
        };
        try {
            const hashed_password = await hashPassword(adminUser.password);
            db.run(`INSERT INTO users (email, username, password, role) VALUES (?,?,?,?)`, [adminUser.email, adminUser.username, hashed_password, adminUser.role], (err) => {
                if(err) {
                    console.error(`Error inserting into database: ${err.message}`)
                    return;
                }
                console.log('admin user created succesfully')
                db.close();
            })
        } catch (e) {
            console.error(`Error hashing password ${e}`)
        }
    })
}

createAdmin();