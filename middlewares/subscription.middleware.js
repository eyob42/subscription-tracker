import Subscription from "../models/subscription.model.js"

export const createSubscription = async (req, res , next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body, //everything that the user passes into this call
            user: req.user._id, //we have to know which user is trying to the subscription
        });

        res.status(201).json({
            success: true,
            data: subscription
        })
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async(req , res, next) => {
    try {
        // Check if user is the same as the one in the token
        if (req.user.id !== req.params.id) {
            const error = new Error('Your not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({ success: true, data: subscriptions})

    } catch(error) {
        next(error)
    }
}