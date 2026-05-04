import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoute.js';


const port = process.env.PORT || 8000; //frontend run in 3000

connectDB();
const app = express();


//first route
app.get('/', (req,res) => {
    res.send('Api is running...');
});

app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => console.log(`server running on port ${port}`));
