import Subscription from "../models/subscription.model.js";
import { Client } from "@upstash/qstash";  // Correct import
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        // 1. Create the subscription
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        // 2. Initialize QStash client (only if token exists)
        if (process.env.QSTASH_TOKEN) {
            const qstashClient = new Client({
                token: process.env.QSTASH_TOKEN
            });

            // 3. Trigger the workflow
            const { messageId } = await qstashClient.publishJSON({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription._id,
                },
                retries: 0,
            });
            
            console.log(`✅ Workflow triggered: ${messageId}`);
        } else {
            console.log('⚠️ QSTASH_TOKEN not set, skipping workflow trigger');
        }

        // 4. Return success response
        res.status(201).json({
            success: true,
            data: subscription
        });

    } catch (error) {
        console.error('❌ Error creating subscription:', error);
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if user is the same as the one in the token
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ 
            success: true, 
            data: subscriptions
        });

    } catch (error) {
        next(error);
    }
};