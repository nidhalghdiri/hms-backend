const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First Name is Required"],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      required: [true, "Last Name is Required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      required: [true, "UserName is Required"],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    picture: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAMFBMVEX+/v68vb////+3uLr29vb7+/vt7u6ztLbx8fHFxse/wMLg4eHP0NHp6eq/wMDa2tsrhruyAAAC7ElEQVRoge2b2ZLjIAxFQSw2BsL//23bzjJJtxcJS2Zm2vcpVa7KsdiErhKlLl26dOnvEkxqglWu9973Tp37AgA2Bt11xpiu0yna0+gAPhij/8iY4M+hg03v4Ac+2RPg4Ief6BE+eHE4xCXyTI/CcMhr6BGeReFgu1W01p3knIO6baC1vik5OJT1EZ9HvYixwW6SJ4mNOixs7G+BJyE2ImyxwNe39lvgQpscAiLuIMJGDbnQoINHsUWOdcx0S004JFTcIrsMtdSEFts/wL79Uvb/N98t91jLsyVjwpa5MLbMJS1zaNu7Q8M7U8u7ooJ+l93LXdB3ApcLe2S77ZpIO8mCzG/WgrIl+NY+ky/AV8tBwULwBY8rbOmoZ3gfFryeILe7PuAQv9k9ZohnOmzlZp66lZPctRcdXJ9jjLl3LUxVgEZm7u8S7EqM63JJYdBmUUNIJVsBPEzbajBmJ4GPz0t2rHgAWxbd40W+Tj0bfQw5aSz5Tg+Zx91c9Op38RydBNjzUFfphzsJ0KPn+Sf9WIKpDfoBD/X3N1AVM/2p2nEHdxitdd2VggVdCd+vgHCqGPZjy+xNAx29W3thRb87I10lFJw45Vs9OLKIFSJj2GPgpCMG3FbNR2aTShacl4YWadCRHiJWgYBWinO6aRMOjnXISQ3i7VYzXRSjk3mpkY42trP8KcJCZ17mNJeVd5mPuQy90MENzGx8Ekc65SJsxZa7nzJo1w98QzZn8r6z0ZmM+2ghsbmPFsLBdrEbsFuuNf49hk7gfDXJi40/W1qe5+w5lHBR5Z5wWnHAVHs/hL86KBan5V208h+gsJEHsu2x2A6qUJXRNf/k+TBZ5zqDbzJx91zrHXKs93Qn8zpU4o0J8VhfeOpFlYFkYd8jHpJXHFYy9DntNw3ewKFwgF94sLnML7D1BtPTNHcteLsm9zaQzXHu13Td/HeDWfPnqVXz6BIKdoueX27t9EcL73trPx+cIPGu2KVLly7V6AvvEiL0BZXVEwAAAABJRU5ErkJggg==",
    },
    gender: {
      type: String,
      required: [true, "Gender is Required"],
      trim: true,
    },
    bYear: {
      type: Number,
      trim: true,
    },
    bMonth: {
      type: Number,
      trim: true,
    },
    bDay: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    roles: Joi.array(),
    picture: Joi.string(),
    gender: Joi.string().required(),
    bYear: Joi.number().integer().min(1900).max(2013),
    bMonth: Joi.number().integer().min(1).max(12),
    bDay: Joi.number().integer().min(1).max(31),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
