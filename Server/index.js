const express = require('express');
const cors = require('cors');
const app = express();

// Import route handlers
const authRoutes = require('./Routes/Authroutes');
const waiterRoutes = require('./Routes/Waiterroutes');
const receptionistRoutes = require('./Routes/Receptionroutes');
const adminRoutes = require('./Routes/Adminroutes');


const verifyToken = require('./Middleware/TokenVerification');
const checkRole = require('./Middleware/RoleVerification');


app.use(cors());
app.use(express.json());


// Mount route handlers
app.use('/auth', authRoutes); 

app.use(verifyToken);

// Apply role checking middleware to specific routes
app.use('/waiter', checkRole('waiter'), waiterRoutes);
app.use('/reception', checkRole('receptionist'), receptionistRoutes);
app.use('/admin', checkRole('admin'), adminRoutes);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
