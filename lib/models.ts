import mongoose, { Schema, model, models } from "mongoose";

// --- User Schema ---
const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    image: { type: String },
    emailVerified: { type: Date },
  },
  { timestamps: true },
);

export const User = models.User || model("User", UserSchema);

// --- List Schema ---
const ListSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyIds: [{ type: String }], // Array of strings (company IDs)
  },
  { timestamps: true },
);

export const List = models.List || model("List", ListSchema);

// --- Note Schema ---
const NoteSchema = new Schema(
  {
    content: { type: String, required: true },
    companyId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Compound index to ensure one note per company per user
NoteSchema.index({ userId: 1, companyId: 1 }, { unique: true });

export const Note = models.Note || model("Note", NoteSchema);

// --- SavedSearch Schema ---
const SavedSearchSchema = new Schema(
  {
    query: { type: String, required: true },
    name: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const SavedSearch = models.SavedSearch || model("SavedSearch", SavedSearchSchema);
