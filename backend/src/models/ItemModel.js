const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    customId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["appetizers", "mains", "seasonal", "desserts", "drinks"],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    ingredients: [{ type: String }],
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
    },
    badge: {
      type: String,
      enum: ["Chef's Pick", "Trending", "Seasonal", null, ""],
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id =
          ret.customId ||
          (ret._id
            ? ret._id.toString()
            : doc && doc._id
            ? doc._id.toString()
            : String((doc && doc.id) || ""));
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Item", itemSchema);
