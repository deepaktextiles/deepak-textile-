import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `DT-${year}-${randomSuffix}`;
};

export const createOrder = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required to place an order." });
    }

    const { items, shippingAddress, billingAddress, notes } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "Order must include at least one product." });
    }

    const populatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.active) {
        return res.status(400).json({
          success: false,
          message: `Product is currently unavailable or inactive.`,
        });
      }

      if (item.quantity < product.minimumOrderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum Order Quantity (MOQ) for "${product.name}" is ${product.minimumOrderQuantity} ${product.unit}. You requested ${item.quantity}.`,
        });
      }

      const unitPrice = product.wholesalePrice || product.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      populatedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images[0] || "",
        variant: item.variant || {},
        quantity: item.quantity,
        unitPrice,
        total: itemTotal,
      });
    }

    const tax = Math.round(subtotal * 0.05); // 5% GST
    const shipping = subtotal >= 50000 ? 0 : 750;
    const total = subtotal + tax + shipping;

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      customer: req.user._id,
      orderNumber,
      items: populatedItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully. Our logistics and dispatch team will process your order.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name sku images");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("customer", "name email phone companyName GSTNumber")
      .populate("items.product", "name sku images wholesalePrice");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (
      req.user &&
      req.user.role === "customer" &&
      String(order.customer._id) !== String(req.user._id)
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized access to order details." });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, search, page = 1, limit = 15 } = req.query;

    const query = {};

    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [
        { orderNumber: regex },
        { "shippingAddress.name": regex },
        { "shippingAddress.companyName": regex },
        { "shippingAddress.phone": regex },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer", "name email phone companyName GSTNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, internalNotes } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
          ...(internalNotes !== undefined && { internalNotes }),
        },
      },
      { new: true }
    ).populate("customer", "name email phone companyName");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};
