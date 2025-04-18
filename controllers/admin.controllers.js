/* controllers / functionalities for admin */
// Create User
export const createUser = (req, res, next) => {
    const { email, username, password } = req.body;

    if (!username || !password) return res.status(404).json({ msg: 'Username or Password not found' })
    
    db.run('INSERT INTO users (email, username, password) VALUES (?,?,?)', [email, username, password], (err) => {
        if (err) next(err);
        res.status(201).json({ msg: 'User has been created succesfully' });
    })
}

// Get User
export const getUser = (req, res, next) => {
    const { id } = req.params;

    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, rows) => {
        if (err) next(err);
        res.status(200).json(rows);
    })
}

// Delete User
export const deleteUser = (req, res, next) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, [id], (err) => {
        if (err) return next(err);
        
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) next(err);
            res.status(200).json(rows);
        })
    })
}

// Update user
export const updateUser = (req, res, next) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const fields = [];
    const values = [];

    if (username && username.trim() !== '') {
        fields.push('username = ?');
        values.push(username.trim());
    }

    if (email && email.trim() !== '') {
        fields.push('email = ?');
        values.push(email.trim());
    }

    if (password && password.trim() !== '') {
        fields.push('password = ?');
        values.push(password.trim());
    }

    if (fields.length === 0) {
        return res.status(400).json({ msg: 'No fields to update' });
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.run(query, values, (err) => {
        if (err) next(err);

        db.all(`SELECT * FROM users WHERE id = ?`, [id], (err, rows) => {
            if (err) next(err);
            res.status(200).json(rows);
        })
    })
}

// Get users
export const getUsers =  (req, res, next) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) next(err);
        res.status(200).json(rows);
    })
}

// Delete users
export const deleteUsers = (req, res, next) => {
    db.run(`DROP TABLE IF EXISTS users`, [], (err) => {
        if (err) next(err);
    })
    
    res.status(200).json({ msg: 'Users deleted succesfully' });
}
