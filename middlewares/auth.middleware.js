import jwt from 'jsonwebtoken';
import { JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async ( req, res , next) => {

    let token;

    try{
        // 1. Check if token exists in headers
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }


        // 2. If no token, reject
        if(!token) return res.status(401).json({
            message: 'Unauthorized'
        });


        // 3. Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);


        // 4. Find the user in database
        const user = await User.findById(decoded.userId);


        // 5. If user doesn't exist, reject
        if(!user) return res.status(401).json({
            message: 'Unauthorized'
        });


         // 6. Attach user to request for next middleware/routes
        req.user = user;


        // 7. Continue to the next middleware/route
        next();
        
    } catch (error) {

        // 8. Handle any errors (invalid token, expired token, etc.)
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message
        })
    }
}



export default authorize;