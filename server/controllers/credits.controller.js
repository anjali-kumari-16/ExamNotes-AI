import Stripe from "stripe"
import UserModel from "../models/user.models.js";
import dotenv from "dotenv"
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300,
};
export const createCreditsOrder = async (req, res) => {
    try {
        const userId = req.userId
        const { amount } = req.body;
        if (!CREDIT_MAP[amount]) {
            return res.status(400).json({ error: "Invalid credit plan" });
        }
            const clientUrl = req.headers.origin || process.env.CLIENT_URL;
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                success_url: `${clientUrl}/payment-success`,
                cancel_url: `${clientUrl}/payment-fail`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${CREDIT_MAP[amount]} Credits`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
                credits: CREDIT_MAP[amount],
            }


        })
        res.status(200).json({ url: session.url })



    }
    catch (error) {
        console.log("Error in creating credits order", error);
        return res.status(500).json({ error: "Failed to create credits order" });
    }
}
// check credits is success or not with the help of webhook
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )

    }
    catch (error) {
        console.log("Webhook signature error:", error.message);
        return res.status(400).send("Webhook Error")

    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const creditsToAdd = session.metadata.credits;
        if (!userId || !creditsToAdd) {
            return res.status(400).json({ message: "Invalid metadata" })
        }
        const user = await UserModel.findByIdAndUpdate(userId, {
            $inc: { credits: creditsToAdd },
            $set: { isCreditAvailable: true },
        }, { new: true })
    }
    res.json({ recived: true });

}



