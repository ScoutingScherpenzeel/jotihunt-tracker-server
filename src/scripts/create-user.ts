import mongoose from "mongoose";
import { parseArgs } from "util";
import { User } from "../models/user.model";

async function createUser(email: string, password: string, name: string, admin: boolean = false) {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);

    const hashedPassword = await Bun.password.hash(password);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    console.log("User created successfully", user._id.toString());

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    name: {
      type: "string",
    },
    admin: {
      type: "boolean",
      default: false,
    },
  },
  strict: true,
  allowPositionals: true,
});

if (!values.email || !values.password || !values.name) {
  console.error("Email, password and name are required (use flags --email, --password and --name)");
  process.exit(1);
}

await createUser(values.email, values.password, values.name, values.admin);
