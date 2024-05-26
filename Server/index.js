const express = require('express');
const app = express();

// Import route handlers
const waiterRoutes = require('./Routes/Waiterroutes');
const receptionistRoutes = require('./Routes/Receptionroutes');
const adminRoutes = require('./Routes/Adminroutes');

// Mount route handlers
app.use('/waiter', waiterRoutes);
app.use('/reception', receptionistRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
