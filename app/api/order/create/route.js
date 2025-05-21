import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {

    try{

        const {userId} = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {

            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        const amount = await items.reduce(async (acc, items) => {
            const product = await Product.findById(items.product);
            return await acc + product.offerPrice * items.quantity;
        },0)
        await inngest.send({
            name: 'order/created',
            data:{
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        })
        // clear user cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({success: true, message: 'Order Placed'})



} catch (error) {
    console.log(error)
    return NextResponse.json({success: false, message: error.message})
}
}
